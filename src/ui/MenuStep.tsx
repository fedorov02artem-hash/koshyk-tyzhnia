import { useState } from 'react'
import { DISH_BY_ID } from '../domain/dishes'
import { dishNutrition } from '../domain/nutrition'
import { averageDay, isLeftover, SLOT_ORDER, type PlanSummary } from '../domain/planner'
import { DEPARTMENT_NAMES, packPrice, PRODUCT_BY_ID, STORES } from '../domain/products'
import type { Department, Household, MealSlot } from '../domain/types'
import { DAY_NAMES, SLOT_LABELS, uah } from './labels'

interface Props {
  household: Household
  plan: PlanSummary
  onRegenerate: () => void
  onSwap: (day: number, slot: MealSlot) => void
}

const storeName = (id: string) => STORES.find((s) => s.id === id)!.name

export function MenuStep({ household: h, plan, onRegenerate, onSwap }: Props) {
  const [tab, setTab] = useState<'menu' | 'list'>('menu')
  const share = Math.min(plan.cost / Math.max(h.weeklyBudget, 1), 1.5)
  const over = plan.overBudget > 0
  const avg = averageDay(h, plan.grid)
  const slots = SLOT_ORDER.filter((s) => h.meals.includes(s))

  return (
    <section className="stack">
      <div className="card summary">
        <div className="row-between">
          <div>
            <span className="muted small">Кошик на тиждень · {storeName(plan.store)}</span>
            <div className="total">{uah(plan.cost)}</div>
          </div>
          <div className="right">
            <span className="muted small">Бюджет</span>
            <div className="budget">{uah(h.weeklyBudget)}</div>
          </div>
        </div>
        <div className={over ? 'bar over' : 'bar'}>
          <span style={{ width: `${Math.min(share, 1) * 100}%` }} />
        </div>
        <p className={over ? 'error small' : 'muted small'}>
          {over
            ? `Не вкладаємось на ${uah(plan.overBudget)}. Спробуйте інший магазин, менше перекусів або більший бюджет.`
            : `Залишок ${uah(h.weeklyBudget - plan.cost)}. Ціни орієнтовні, ціла упаковка кожного продукту.`}
        </p>
        <div className="stats">
          {h.people.map((p, i) => (
            <div key={i}>
              <span className="muted small">{p.name}</span>
              <strong>{plan.targets[i]} ккал</strong>
            </div>
          ))}
          <div>
            <span className="muted small">Б / Ж / В на порцію-день</span>
            <strong>{Math.round(avg.protein)} / {Math.round(avg.fat)} / {Math.round(avg.carbs)} г</strong>
          </div>
        </div>
      </div>

      <div className="card">
        <span className="label">Цей кошик в інших магазинах</span>
        <ul className="stores">
          {plan.storeTotals.map((t, i) => (
            <li key={t.store} className={t.store === plan.store ? 'current' : ''}>
              <span>{storeName(t.store)}</span>
              <span className="dots" />
              <span>{uah(t.total)}</span>
              {i === 0 && <span className="tag">найдешевше</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="seg">
        <button className={tab === 'menu' ? 'on' : ''} onClick={() => setTab('menu')}>Меню</button>
        <button className={tab === 'list' ? 'on' : ''} onClick={() => setTab('list')}>Список покупок</button>
      </div>

      {tab === 'menu' ? (
        <>
          {plan.grid.map((day, d) => {
            const dayKcal = slots.reduce((sum, s) => sum + (day[s] ? dishNutrition(DISH_BY_ID[day[s]!]).kcal : 0), 0)
            return (
              <div key={d} className="card day">
                <div className="row-between">
                  <h2>{DAY_NAMES[d]}</h2>
                  <span className="muted small">{Math.round(dayKcal)} ккал на стандартну порцію</span>
                </div>
                {slots.map((s) => {
                  const id = day[s]
                  if (!id) return null
                  const dish = DISH_BY_ID[id]
                  const leftover = isLeftover(plan.grid, d, s)
                  return (
                    <div key={s} className="meal">
                      <span className="slot">{SLOT_LABELS[s]}</span>
                      <div className="dish">
                        <span>{dish.name}</span>
                        <span className="muted small">
                          {Math.round(dishNutrition(dish).kcal)} ккал · {leftover ? 'залишок з учора' : `${dish.minutes} хв`}
                          {dish.batch && !leftover && plan.grid[d + 1]?.[s] === id && ' · готуємо на 2 дні'}
                        </span>
                      </div>
                      <button className="icon" title="Замінити страву" aria-label={`Замінити: ${dish.name}`} onClick={() => onSwap(d, s)}>
                        <svg viewBox="0 0 24 24" width="18" height="18"><path d="M4 12a8 8 0 0 1 13.7-5.7L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.7L4 15.5M4 20v-4.5h4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </>
      ) : (
        <ShoppingList plan={plan} />
      )}

      <button className="secondary" onClick={onRegenerate}>Скласти інше меню</button>
    </section>
  )
}

function ShoppingList({ plan }: { plan: PlanSummary }) {
  const groups = new Map<Department, PlanSummary['shopping']>()
  for (const item of plan.shopping) {
    const dep = PRODUCT_BY_ID[item.productId].department
    groups.set(dep, [...(groups.get(dep) ?? []), item])
  }
  return (
    <>
      {(Object.keys(DEPARTMENT_NAMES) as Department[])
        .filter((d) => groups.has(d))
        .map((dep) => (
          <div key={dep} className="card">
            <span className="label">{DEPARTMENT_NAMES[dep]}</span>
            <ul className="shopping">
              {groups.get(dep)!.map((it) => {
                const p = PRODUCT_BY_ID[it.productId]
                return (
                  <li key={it.productId}>
                    <div>
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
    </>
  )
}
