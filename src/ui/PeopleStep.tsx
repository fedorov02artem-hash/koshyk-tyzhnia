import { useEffect, useState, type ReactNode } from 'react'
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
  /** Editing one person from the list: return to the list when done. */
  const [single, setSingle] = useState(false)
  const count = h.people.length

  const setCount = (n: number) => {
    const people = Array.from({ length: n }, (_, i) => h.people[i] ?? newPerson(i + 1))
    onChange({ ...h, people, surveyed: false })
    setIndex(null)
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
              <button className="ghost" onClick={() => { setSingle(true); setIndex(i) }}>Змінити</button>
            </li>
          ))}
        </ul>
        {h.surveyed ? (
          <>
            <button className="primary" onClick={() => onDone(h)}>Скласти меню</button>
            <button className="secondary" onClick={() => { setSingle(false); setIndex(0) }}>Пройти анкету заново</button>
          </>
        ) : (
          <button className="primary" onClick={() => { setSingle(false); setIndex(0) }}>Пройти анкету</button>
        )}
        {error && <p className="error">{error}</p>}
      </section>
    )
  }

  const person = h.people[index]
  const update = (patch: Partial<Person>) =>
    onChange({ ...h, people: h.people.map((p, i) => (i === index ? { ...p, ...patch } : p)) })

  const finishPerson = () => {
    if (single) {
      setIndex(null)
    } else if (index === count - 1) {
      setIndex(null)
      onDone({ ...h, surveyed: true })
    } else setIndex(index + 1)
  }

  return (
    <PersonWizard
      key={index}
      person={person}
      label={count > 1 ? `Людина ${index + 1} з ${count}` : 'Анкета'}
      finishLabel={single ? 'Зберегти' : index === count - 1 ? 'Скласти меню' : 'Наступна людина'}
      update={update}
      onExit={() => (index === 0 || single ? setIndex(null) : setIndex(index - 1))}
      onFinish={finishPerson}
    />
  )
}

type Question = 'name' | 'sex' | 'age' | 'height' | 'weight' | 'activity' | 'goal' | 'norm' | 'allergies' | 'excluded'
const QUESTIONS: Question[] = ['name', 'sex', 'age', 'height', 'weight', 'activity', 'goal', 'norm', 'allergies', 'excluded']

interface WizardProps {
  person: Person
  label: string
  finishLabel: string
  update: (patch: Partial<Person>) => void
  onExit: () => void
  onFinish: () => void
}

/** One question per screen. Single-choice answers move on by themselves. */
function PersonWizard({ person: p, label, finishLabel, update, onExit, onFinish }: WizardProps) {
  const [q, setQ] = useState(0)
  const [manualOpen, setManualOpen] = useState(p.manualKcal !== undefined)
  const question = QUESTIONS[q]
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [q])
  const last = q === QUESTIONS.length - 1
  const next = () => (last ? onFinish() : setQ(q + 1))
  const back = () => (q === 0 ? onExit() : setQ(q - 1))
  const choose = (patch: Partial<Person>) => {
    update(patch)
    next()
  }
  const who = p.name.trim() || 'Ця людина'

  let title = ''
  let hint: string | undefined
  let body: ReactNode = null
  let canNext = true
  let showNext = true

  switch (question) {
    case 'name':
      title = 'Як звати?'
      hint = 'Щоб розрізняти порції в меню.'
      body = <BigInput autoFocus value={p.name} onChange={(name) => update({ name })} onEnter={next} />
      canNext = p.name.trim().length > 0
      break
    case 'sex':
      title = `${who}: стать`
      hint = 'Потрібно для розрахунку норми калорій.'
      body = (
        <Choices
          options={(Object.keys(SEX_LABELS) as Sex[]).map((s) => ({ value: s, title: SEX_LABELS[s] }))}
          value={p.sex}
          onPick={(sex) => choose({ sex })}
        />
      )
      showNext = false
      break
    case 'age':
      title = 'Скільки років?'
      body = <BigNumber autoFocus value={p.age} unit="років" onChange={(age) => update({ age })} onEnter={next} />
      canNext = p.age > 0 && p.age < 110
      break
    case 'height':
      title = 'Який зріст?'
      body = <BigNumber autoFocus value={p.heightCm} unit="см" onChange={(heightCm) => update({ heightCm })} onEnter={next} />
      canNext = p.heightCm >= 50 && p.heightCm <= 250
      break
    case 'weight':
      title = 'Яка вага?'
      body = <BigNumber autoFocus value={p.weightKg} unit="кг" onChange={(weightKg) => update({ weightKg })} onEnter={next} />
      canNext = p.weightKg >= 10 && p.weightKg <= 300
      break
    case 'activity':
      title = 'Скільки руху протягом дня?'
      body = (
        <Choices
          options={(Object.keys(ACTIVITY_LABELS) as Activity[]).map((a) => ({ value: a, title: ACTIVITY_LABELS[a], hint: ACTIVITY_HINTS[a] }))}
          value={p.activity}
          onPick={(activity) => choose({ activity })}
        />
      )
      showNext = false
      break
    case 'goal':
      title = 'Яка мета?'
      body = (
        <Choices
          options={(Object.keys(GOAL_LABELS) as Goal[]).map((g) => ({ value: g, title: GOAL_LABELS[g], hint: GOAL_HINTS[g] }))}
          value={p.goal}
          onPick={(goal) => choose({ goal })}
        />
      )
      showNext = false
      break
    case 'norm':
      title = 'Норма калорій'
      hint = manualOpen ? 'Вкажіть свою добову норму.' : 'Порахували за вашими відповідями. Можна вказати свою.'
      body = manualOpen ? (
        <>
          <BigNumber autoFocus value={p.manualKcal ?? dailyKcal(p)} unit="ккал" onChange={(manualKcal) => update({ manualKcal })} onEnter={next} />
          <button className="ghost" onClick={() => { update({ manualKcal: undefined }); setManualOpen(false) }}>Порахувати за анкетою</button>
        </>
      ) : (
        <>
          <div className="norm-big">{dailyKcal({ ...p, manualKcal: undefined })} <span>ккал на день</span></div>
          <Choices
            options={[
              { value: 'ok', title: 'Підходить' },
              { value: 'own', title: 'Знаю свою норму' },
            ]}
            onPick={(v) => {
              if (v === 'ok') choose({ manualKcal: undefined })
              else {
                update({ manualKcal: dailyKcal({ ...p, manualKcal: undefined }) })
                setManualOpen(true)
              }
            }}
          />
        </>
      )
      canNext = !manualOpen || (p.manualKcal ?? 0) >= 800
      showNext = manualOpen
      break
    case 'allergies':
      title = 'Є алергії чи непереносимість?'
      hint = 'Оберіть усе, що підходить. Такі страви не потраплять у меню.'
      body = (
        <div className="chips">
          {(Object.keys(ALLERGEN_LABELS) as Allergen[]).map((a) => (
            <button
              key={a}
              className={p.allergies.includes(a) ? 'chip warn' : 'chip'}
              onClick={() => update({ allergies: p.allergies.includes(a) ? p.allergies.filter((x) => x !== a) : [...p.allergies, a] })}
            >
              {ALLERGEN_LABELS[a]}
            </button>
          ))}
        </div>
      )
      break
    case 'excluded':
      title = 'Чого не їсть?'
      hint = 'Продукти, які просто не подобаються. Можна пропустити.'
      body = (
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
      )
      break
  }

  const multi = question === 'allergies' || question === 'excluded'
  const empty = question === 'allergies' ? p.allergies.length === 0 : p.excludedProducts.length === 0

  return (
    <section className="wizard">
      <div className="wizard-top">
        <button className="icon" aria-label="Назад" onClick={back}>
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="progress" aria-label={`Питання ${q + 1} з ${QUESTIONS.length}`}>
          <span style={{ width: `${((q + 1) / QUESTIONS.length) * 100}%` }} />
        </div>
        <span className="muted small">{label}</span>
      </div>

      <div className="question" key={question}>
        <h1>{title}</h1>
        {hint && <p className="muted">{hint}</p>}
        <div className="answer">{body}</div>
      </div>

      {showNext && (
        <button className="primary" disabled={!canNext} onClick={next}>
          {last ? finishLabel : multi && empty ? 'Немає, далі' : 'Далі'}
        </button>
      )}
    </section>
  )
}

const ACTIVITY_HINTS: Record<Activity, string> = {
  low: 'Сидяча робота, мало ходьби',
  light: 'Прогулянки, легкі тренування 1–2 рази',
  moderate: 'Тренування 3–5 разів на тиждень',
  high: 'Фізична робота або щоденний спорт',
}

const GOAL_HINTS: Record<Goal, string> = {
  lose: 'Невеликий дефіцит калорій',
  keep: 'Їсти стільки, скільки витрачаєте',
  gain: 'Трохи більше калорій і білка',
}

export function Choices<T extends string>({ options, value, onPick }: { options: { value: T; title: string; hint?: string }[]; value?: T; onPick: (v: T) => void }) {
  return (
    <div className="choices">
      {options.map((o) => (
        <button key={o.value} className={o.value === value ? 'choice on' : 'choice'} onClick={() => onPick(o.value)}>
          <strong>{o.title}</strong>
          {o.hint && <span>{o.hint}</span>}
        </button>
      ))}
    </div>
  )
}

function BigInput({ value, onChange, onEnter, autoFocus }: { value: string; onChange: (v: string) => void; onEnter: () => void; autoFocus?: boolean }) {
  return (
    <input
      className="big-input"
      autoFocus={autoFocus}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && onEnter()}
    />
  )
}

export function BigNumber({ value, unit, onChange, onEnter, autoFocus }: { value: number; unit: string; onChange: (v: number) => void; onEnter: () => void; autoFocus?: boolean }) {
  return (
    <div className="big-number">
      <input
        type="number"
        inputMode="numeric"
        autoFocus={autoFocus}
        value={value || ''}
        onChange={(e) => onChange(Number(e.target.value))}
        onKeyDown={(e) => e.key === 'Enter' && onEnter()}
      />
      <span>{unit}</span>
    </div>
  )
}
