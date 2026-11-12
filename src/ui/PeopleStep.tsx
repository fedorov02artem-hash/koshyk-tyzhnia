import { useState } from 'react'
import { newPerson } from '../domain/people'
import { dailyKcal } from '../domain/nutrition'
import { PRODUCTS, PRODUCT_BY_ID } from '../domain/products'
import type { Activity, Allergen, Goal, Household, Person, Sex } from '../domain/types'
import { ACTIVITY_LABELS, ALLERGEN_LABELS, GOAL_LABELS, SEX_LABELS } from './labels'

interface Props {
  household: Household
  onChange: (h: Household) => void
  onDone: (h: Household) => void
  error?: string
}

/** Count first, then a short questionnaire for each person in turn. Changing the count restarts it. */
export function PeopleStep({ household: h, onChange, onDone, error }: Props) {
  const [index, setIndex] = useState<number | null>(null)
  const count = h.people.length

  const setCount = (n: number) => {
    const people = Array.from({ length: n }, (_, i) => h.people[i] ?? newPerson(i + 1))
    onChange({ ...h, people, surveyed: false })
    setIndex(0)
  }

  if (index === null) {
    return (
      <section className="stack">
        <div>
          <h1>Хто їстиме</h1>
          <p className="muted">Для кожного коротка анкета: норма калорій, мета і алергії. Порції рахуються окремо.</p>
        </div>
        <div className="card row-between">
          <span className="label">Кількість людей</span>
          <div className="stepper">
            <button aria-label="Менше" disabled={count <= 1} onClick={() => setCount(count - 1)}>−</button>
            <output>{count}</output>
            <button aria-label="Більше" disabled={count >= 8} onClick={() => setCount(count + 1)}>+</button>
          </div>
        </div>
        <ul className="people">
          {h.people.map((p, i) => (
            <li key={i} className="card row-between">
              <div>
                <strong>{p.name}</strong>
                <div className="muted small">
                  {dailyKcal(p)} ккал/день · {GOAL_LABELS[p.goal].toLowerCase()}
                  {p.allergies.length > 0 && ` · без: ${p.allergies.map((a) => ALLERGEN_LABELS[a].toLowerCase()).join(', ')}`}
                </div>
              </div>
              <button className="ghost" onClick={() => setIndex(i)}>Змінити</button>
            </li>
          ))}
        </ul>
        {h.surveyed ? (
          <>
            <button className="primary" onClick={() => onDone(h)}>Скласти меню</button>
            <button className="secondary" onClick={() => setIndex(0)}>Пройти анкету заново</button>
          </>
        ) : (
          <button className="primary" onClick={() => setIndex(0)}>Пройти анкету</button>
        )}
        {error && <p className="error">{error}</p>}
      </section>
    )
  }

  const person = h.people[index]
  const update = (patch: Partial<Person>) =>
    onChange({ ...h, people: h.people.map((p, i) => (i === index ? { ...p, ...patch } : p)) })
  const last = index === count - 1

  return (
    <section className="stack">
      <div>
        <p className="muted small">Людина {index + 1} з {count}</p>
        <h1>{person.name || 'Без імені'}</h1>
      </div>
      <PersonForm person={person} update={update} />
      <div className="row-gap">
        <button className="secondary" onClick={() => setIndex(index === 0 ? null : index - 1)}>Назад</button>
        <button
          className="primary grow"
          onClick={() => {
            if (last) {
              setIndex(null)
              onDone({ ...h, surveyed: true })
            } else setIndex(index + 1)
          }}
        >
          {last ? 'Скласти меню' : 'Наступна людина'}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
    </section>
  )
}

function PersonForm({ person: p, update }: { person: Person; update: (patch: Partial<Person>) => void }) {
  const manual = p.manualKcal !== undefined
  const toggleAllergy = (a: Allergen) =>
    update({ allergies: p.allergies.includes(a) ? p.allergies.filter((x) => x !== a) : [...p.allergies, a] })

  return (
    <>
      <div className="card stack-sm">
        <label className="field">
          <span className="label">Ім'я</span>
          <input value={p.name} onChange={(e) => update({ name: e.target.value })} />
        </label>
        <div className="seg">
          {(Object.keys(SEX_LABELS) as Sex[]).map((s) => (
            <button key={s} className={p.sex === s ? 'on' : ''} onClick={() => update({ sex: s })}>{SEX_LABELS[s]}</button>
          ))}
        </div>
        <div className="grid3">
          <NumberField label="Вік" unit="р." value={p.age} onChange={(age) => update({ age })} />
          <NumberField label="Зріст" unit="см" value={p.heightCm} onChange={(heightCm) => update({ heightCm })} />
          <NumberField label="Вага" unit="кг" value={p.weightKg} onChange={(weightKg) => update({ weightKg })} />
        </div>
      </div>

      <div className="card stack-sm">
        <span className="label">Мета</span>
        <div className="seg">
          {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => (
            <button key={g} className={p.goal === g ? 'on' : ''} onClick={() => update({ goal: g })}>{GOAL_LABELS[g]}</button>
          ))}
        </div>
        <span className="label">Активність</span>
        <div className="chips">
          {(Object.keys(ACTIVITY_LABELS) as Activity[]).map((a) => (
            <button key={a} className={p.activity === a ? 'chip on' : 'chip'} onClick={() => update({ activity: a })}>{ACTIVITY_LABELS[a]}</button>
          ))}
        </div>
        <div className="norm">
          <div>
            <span className="muted small">{manual ? 'Ваша норма' : 'Рекомендована норма'}</span>
            {manual ? (
              <div className="money-input">
                <input type="number" inputMode="numeric" value={p.manualKcal || ''} onChange={(e) => update({ manualKcal: Number(e.target.value) })} />
                <span>ккал</span>
              </div>
            ) : (
              <strong className="big">{dailyKcal(p)} ккал</strong>
            )}
          </div>
          <button className="ghost" onClick={() => update({ manualKcal: manual ? undefined : dailyKcal(p) })}>
            {manual ? 'Порахувати за анкетою' : 'Знаю свою норму'}
          </button>
        </div>
      </div>

      <div className="card stack-sm">
        <span className="label">Алергії та непереносимість</span>
        <div className="chips">
          {(Object.keys(ALLERGEN_LABELS) as Allergen[]).map((a) => (
            <button key={a} className={p.allergies.includes(a) ? 'chip warn' : 'chip'} onClick={() => toggleAllergy(a)}>
              {ALLERGEN_LABELS[a]}
            </button>
          ))}
        </div>
        <span className="label">Не їсть</span>
        <div className="chips">
          {p.excludedProducts.map((id) => (
            <button key={id} className="chip warn" onClick={() => update({ excludedProducts: p.excludedProducts.filter((x) => x !== id) })}>
              {PRODUCT_BY_ID[id].name} ✕
            </button>
          ))}
          <select
            className="chip-select"
            value=""
            onChange={(e) => e.target.value && update({ excludedProducts: [...p.excludedProducts, e.target.value] })}
          >
            <option value="">+ Додати продукт</option>
            {PRODUCTS.filter((x) => !p.excludedProducts.includes(x.id))
              .sort((a, b) => a.name.localeCompare(b.name, 'uk'))
              .map((x) => (
                <option key={x.id} value={x.id}>{x.name}</option>
              ))}
          </select>
        </div>
      </div>
    </>
  )
}

function NumberField({ label, unit, value, onChange }: { label: string; unit: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="field">
      <span className="label">{label}</span>
      <div className="money-input">
        <input type="number" inputMode="numeric" value={value || ''} onChange={(e) => onChange(Number(e.target.value))} />
        <span>{unit}</span>
      </div>
    </label>
  )
}
