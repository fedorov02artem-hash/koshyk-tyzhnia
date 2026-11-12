import { STORES } from '../domain/products'
import { SLOT_ORDER } from '../domain/planner'
import type { DietStyle, Household, MealSlot } from '../domain/types'
import { DIET_LABELS, SLOT_LABELS } from './labels'

interface Props {
  household: Household
  onChange: (h: Household) => void
  onNext: () => void
}

export function SetupStep({ household: h, onChange, onNext }: Props) {
  const toggleMeal = (slot: MealSlot) => {
    const meals = h.meals.includes(slot) ? h.meals.filter((m) => m !== slot) : [...h.meals, slot]
    if (meals.length) onChange({ ...h, meals })
  }

  return (
    <section className="stack">
      <div>
        <h1>Ваш тиждень</h1>
        <p className="muted">Вкажіть бюджет і звички. Меню на 7 днів підлаштується під них.</p>
      </div>

      <div className="card">
        <label className="field">
          <span className="label">Бюджет на тиждень</span>
          <div className="money-input">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={100}
              value={h.weeklyBudget || ''}
              onChange={(e) => onChange({ ...h, weeklyBudget: Number(e.target.value) })}
            />
            <span>₴</span>
          </div>
        </label>
        <div className="presets">
          {[1000, 1500, 2000, 3000, 4000].map((v) => (
            <button key={v} className={v === h.weeklyBudget ? 'chip on' : 'chip'} onClick={() => onChange({ ...h, weeklyBudget: v })}>
              {v} ₴
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <span className="label">Де купуєте</span>
        <div className="chips">
          <button className={h.store === 'cheapest' ? 'chip on' : 'chip'} onClick={() => onChange({ ...h, store: 'cheapest' })}>
            Де найдешевше
          </button>
          {STORES.map((s) => (
            <button key={s.id} className={h.store === s.id ? 'chip on' : 'chip'} onClick={() => onChange({ ...h, store: s.id })}>
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <span className="label">Стиль харчування</span>
        <div className="options">
          {(Object.keys(DIET_LABELS) as DietStyle[]).map((d) => (
            <button key={d} className={h.diet === d ? 'option on' : 'option'} onClick={() => onChange({ ...h, diet: d })}>
              <strong>{DIET_LABELS[d].title}</strong>
              <span>{DIET_LABELS[d].hint}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <span className="label">Прийоми їжі</span>
        <div className="chips">
          {SLOT_ORDER.map((s) => (
            <button key={s} className={h.meals.includes(s) ? 'chip on' : 'chip'} onClick={() => toggleMeal(s)}>
              {SLOT_LABELS[s]}
            </button>
          ))}
        </div>
        <p className="hint">Супи й рагу готуються одразу на два дні, щоб менше стояти біля плити.</p>
      </div>

      <button className="primary" disabled={!h.weeklyBudget} onClick={onNext}>
        Далі: хто їстиме
      </button>
    </section>
  )
}
