import { useState } from 'react'
import { DISH_BY_ID } from '../domain/dishes'
import { dishNutrition, tracksCalories } from '../domain/nutrition'
import { averageDay, isLeftover, SLOT_ORDER, type PlanSummary } from '../domain/planner'
import { DEPARTMENT_NAMES, packPrice, PRODUCT_BY_ID, STORES } from '../domain/products'
import type { Department, Household, MealSlot } from '../domain/types'
import { dishEmoji, dishTint } from './dishArt'
import { Art } from './Tiles'
import { DAY_NAMES, SLOT_LABELS, uah } from './labels'

export type MenuTab = 'week' | 'list' | 'prices'

interface Props {
  household: Household
  plan: PlanSummary
  tab: MenuTab
  onRegenerate: () => void
  onSwap: (day: number, slot: MealSlot) => void
}

const storeName = (id: string) => STORES.find((s) => s.id === id)!.name
const SHORT_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']

export function MenuStep({ household: h, plan, tab, onRegenerate, onSwap }: Props) {
  if (tab === 'list') return <ShoppingList plan={plan} />
  if (tab === 'prices') return <Prices household={h} plan={plan} onRegenerate={onRegenerate} />
  return <Week household={h} plan={plan} onSwap={onSwap} />
}

function BudgetPill({ household: h, plan }: { household: Household; plan: PlanSummary }) {
  const over = plan.overBudget > 0
  return (
    <span className={over ? 'pill over' : 'pill'}>
      {uah(plan.cost)} <span className="of">з {uah(h.weeklyBudget)}</span>
    </span>
  )
}

function Week({ household: h, plan, onSwap }: { household: Household; plan: PlanSummary; onSwap: Props['onSwap'] }) {
  const [day, setDay] = useState(0)
  const slots = SLOT_ORDER.filter((s) => h.meals.includes(s))
  const row = plan.grid[day]
  const dayCost = slots.reduce((sum, s) => sum + (plan.mealCosts[day][s] ?? 0), 0)

  return (
    <section className="stack">
      <div className="page-head">
        <h1>Ваш тиждень</h1>
        <BudgetPill household={h} plan={plan} />
      </div>

      <div className="days" role="tablist">
        {SHORT_DAYS.map((d, i) => (
          <button key={d} role="tab" aria-selected={i === day} className={i === day ? 'day-chip on' : 'day-chip'} onClick={() => setDay(i)}>
            <span>{d}</span>
            <small>{uah(slots.reduce((sum, s) => sum + (plan.mealCosts[i][s] ?? 0), 0)).replace(' ₴', '')}</small>
          </button>
        ))}
      </div>

      <div className="row-between">
        <h2 className="section-title">{DAY_NAMES[day]}</h2>
        <span className="muted small">{uah(dayCost)} за день · {h.people.length > 1 ? `на ${h.people.length} осіб` : 'на 1 особу'}</span>
      </div>

      <div className="recipes">
        {slots.map((s) => {
          const id = row[s]
          if (!id) return null
          const dish = DISH_BY_ID[id]
          const leftover = isLeftover(plan.grid, day, s)
          const cooksTwo = dish.batch && !leftover && plan.grid[day + 1]?.[s] === id
          return (
            <article key={s} className="recipe">
              <div className="recipe-art" style={{ background: dishTint(dish.kind) }}>
                <Art emoji={dishEmoji(id)} className="dish-art" />
                <span className="badge">{SLOT_LABELS[s]}</span>
                {(leftover || cooksTwo) && <span className="badge alt">{leftover ? 'Залишок з учора' : 'Готуємо на 2 дні'}</span>}
                <button className="swap" title="Замінити страву" aria-label={`Замінити: ${dish.name}`} onClick={() => onSwap(day, s)}>
                  <svg viewBox="0 0 24 24" width="18" height="18"><path d="M4 12a8 8 0 0 1 13.7-5.7L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.7L4 15.5M4 20v-4.5h4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
              <div className="recipe-body">
                <h3>{dish.name}</h3>
                <div className="meta">
                  <span>{leftover ? 'Розігріти' : `${dish.minutes} хв`}</span>
                  {tracksCalories(h.people) && <span>{Math.round(dishNutrition(dish).kcal)} ккал</span>}
                  <span className="price">{uah(plan.mealCosts[day][s] ?? 0)}</span>
                </div>
              </div>
            </article>
          )
        })}
      </div>
      <p className="muted small center">
        {tracksCalories(h.people) && 'Ккал на стандартну порцію. Порції кожного рахуються під його норму. '}Ціна на всіх, {storeName(plan.store)}.
      </p>
    </section>
  )
}

export function Prices({ household: h, plan, onRegenerate }: { household: Household; plan: PlanSummary; onRegenerate: () => void }) {
  const share = Math.min(plan.cost / Math.max(h.weeklyBudget, 1), 1)
  const over = plan.overBudget > 0
  const avg = averageDay(h, plan.grid)
  const max = plan.storeTotals[plan.storeTotals.length - 1].total
  return (
    <section className="stack">
      <div className="card summary">
        <span className="muted small">Кошик на тиждень · {storeName(plan.store)}</span>
        <div className="total">{uah(plan.cost)}</div>
        <div className={over ? 'bar over' : 'bar'}><span style={{ width: `${share * 100}%` }} /></div>
        <p className={over ? 'error small' : 'muted small'}>
          {over
            ? `Не вкладаємось на ${uah(plan.overBudget)}. Спробуйте інший магазин, менше перекусів або більший бюджет.`
            : `Бюджет ${uah(h.weeklyBudget)}, залишок ${uah(h.weeklyBudget - plan.cost)}.`}
        </p>
      </div>

      <h2 className="section-title">Цей кошик у магазинах</h2>
      <div className="card">
        <ul className="store-bars">
          {plan.storeTotals.map((t, i) => (
            <li key={t.store} className={t.store === plan.store ? 'current' : ''}>
              <div className="row-between">
                <span>{storeName(t.store)} {i === 0 && <span className="tag">найдешевше</span>}</span>
                <strong>{uah(t.total)}</strong>
              </div>
              <div className="mini-bar"><span style={{ width: `${(t.total / max) * 100}%` }} /></div>
            </li>
          ))}
        </ul>
        <p className="hint">Ціни орієнтовні. Живі ціни магазинів підключимо на наступному етапі.</p>
      </div>

      {tracksCalories(h.people) && (<>
      <h2 className="section-title">Калорії</h2>
      <div className="card stats-grid">
        {h.people.map((p, i) => p.goal === 'save' ? null : (
          <div key={i}>
            <span className="muted small">{p.name}</span>
            <strong>{plan.targets[i]} ккал</strong>
          </div>
        ))}
        <div>
          <span className="muted small">Б / Ж / В, стандартна порція на день</span>
          <strong>{Math.round(avg.protein)} / {Math.round(avg.fat)} / {Math.round(avg.carbs)} г</strong>
        </div>
      </div>
      </>)}

      <button className="secondary" onClick={onRegenerate}>Скласти інше меню</button>
    </section>
  )
}

function ShoppingList({ plan }: { plan: PlanSummary }) {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const groups = new Map<Department, PlanSummary['shopping']>()
  for (const item of plan.shopping) {
    const dep = PRODUCT_BY_ID[item.productId].department
    groups.set(dep, [...(groups.get(dep) ?? []), item])
  }
  const toggle = (id: string) =>
    setChecked((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  return (
    <section className="stack">
      <div className="page-head">
        <h1>Покупки</h1>
        <span className="pill">{uah(plan.cost)}</span>
      </div>
      <p className="muted small">{storeName(plan.store)} · {plan.shopping.length} позицій · куплено {checked.size}</p>
      {(Object.keys(DEPARTMENT_NAMES) as Department[])
        .filter((d) => groups.has(d))
        .map((dep) => (
          <div key={dep}>
            <h2 className="section-title">{DEPARTMENT_NAMES[dep]}</h2>
            <ul className="shopping card">
              {groups.get(dep)!.map((it) => {
                const p = PRODUCT_BY_ID[it.productId]
                const done = checked.has(it.productId)
                return (
                  <li key={it.productId} className={done ? 'done' : ''} onClick={() => toggle(it.productId)}>
                    <span className="check" aria-hidden>{done ? '✓' : ''}</span>
                    <div className="grow">
                      <span>{p.name}</span>
                      <span className="muted small">
                        {it.packs} × {p.packLabel} · потрібно {it.grams >= 1000 ? `${(it.grams / 1000).toFixed(1)} кг` : `${it.grams} г`}
                      </span>
                    </div>
                    <span>{uah(it.packs * packPrice(it.productId, plan.store))}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
    </section>
  )
}
