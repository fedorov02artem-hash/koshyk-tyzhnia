import { useEffect, useState, type ReactNode } from 'react'
import { newPerson } from '../domain/people'
import { dailyKcal } from '../domain/nutrition'
import { PRODUCTS } from '../domain/products'
import type { Activity, Allergen, Goal, Household, Person, Sex } from '../domain/types'
import { EMOJI, Tiles } from './Tiles'
import { ACTIVITY_LABELS, ALLERGEN_LABELS, GOAL_LABELS, SEX_LABELS } from './labels'
import { Wheel } from './Wheel'

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
                  {p.goal === 'save' ? 'без підрахунку калорій' : `${dailyKcal(p)} ккал/день · ${GOAL_LABELS[p.goal].toLowerCase()}`}
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

type Question = 'name' | 'sex' | 'age' | 'goal' | 'height' | 'weight' | 'activity' | 'norm' | 'allergies' | 'liked' | 'excluded'
const ALL_QUESTIONS: Question[] = ['name', 'sex', 'age', 'goal', 'height', 'weight', 'activity', 'norm', 'allergies', 'liked', 'excluded']
/** Without a health goal the body questions and the calorie norm are skipped. */
const CALORIE_QUESTIONS: Question[] = ['height', 'weight', 'activity', 'norm']
const questionsFor = (p: Person) => (p.goal === 'save' ? ALL_QUESTIONS.filter((q) => !CALORIE_QUESTIONS.includes(q)) : ALL_QUESTIONS)

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
  const QUESTIONS = questionsFor(p)
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
        <Tiles
          options={(Object.keys(SEX_LABELS) as Sex[]).map((s) => ({ value: s, title: SEX_LABELS[s], emoji: EMOJI.sex[s] }))}
          selected={[p.sex]}
          onToggle={(sex) => choose({ sex })}
        />
      )
      showNext = false
      break
    case 'age':
      title = 'Скільки років?'
      body = <Wheel label="Вік" value={p.age} min={1} max={100} unit="років" onChange={(age) => update({ age })} />
      break
    case 'height':
      title = 'Який зріст?'
      body = <Wheel label="Зріст" value={p.heightCm} min={80} max={220} unit="см" onChange={(heightCm) => update({ heightCm })} />
      break
    case 'weight':
      title = 'Яка вага?'
      body = <Wheel label="Вага" value={p.weightKg} min={10} max={200} unit="кг" onChange={(weightKg) => update({ weightKg })} />
      break
    case 'activity':
      title = 'Скільки руху протягом дня?'
      body = (
        <Tiles
          options={(Object.keys(ACTIVITY_LABELS) as Activity[]).map((a) => ({ value: a, title: ACTIVITY_LABELS[a], hint: ACTIVITY_HINTS[a], emoji: EMOJI.activity[a] }))}
          selected={[p.activity]}
          onToggle={(activity) => choose({ activity })}
        />
      )
      showNext = false
      break
    case 'goal':
      title = 'Яка мета?'
      hint = 'Якщо мета лише заощадити, калорії не рахуємо.'
      body = (
        <Tiles
          options={(Object.keys(GOAL_LABELS) as Goal[]).map((g) => ({ value: g, title: GOAL_LABELS[g], hint: GOAL_HINTS[g], emoji: EMOJI.goal[g] }))}
          selected={[p.goal]}
          onToggle={(goal) => choose({ goal })}
        />
      )
      showNext = false
      break
    case 'norm':
      title = 'Норма калорій'
      hint = manualOpen ? 'Вкажіть свою добову норму.' : 'Порахували за вашими відповідями. Можна вказати свою.'
      body = manualOpen ? (
        <>
          <Wheel label="Норма калорій" value={p.manualKcal ?? dailyKcal(p)} min={1000} max={4500} step={50} unit="ккал" onChange={(manualKcal) => update({ manualKcal })} />
          <button className="ghost" onClick={() => { update({ manualKcal: undefined }); setManualOpen(false) }}>Порахувати за анкетою</button>
        </>
      ) : (
        <>
          <div className="norm-big">{dailyKcal({ ...p, manualKcal: undefined })} <span>ккал на день</span></div>
          <Tiles
            options={[
              { value: 'ok', title: 'Підходить', emoji: '👍' },
              { value: 'own', title: 'Знаю свою норму', emoji: '✍️' },
            ]}
            selected={[]}
            onToggle={(v) => {
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
      hint = 'Такі страви не потраплять у меню.'
      body = (
        <Tiles
          compact
          options={(Object.keys(ALLERGEN_LABELS) as Allergen[]).map((a) => ({ value: a, title: ALLERGEN_LABELS[a], emoji: EMOJI.allergen[a] }))}
          selected={p.allergies}
          onToggle={(a) => update({ allergies: p.allergies.includes(a) ? p.allergies.filter((x) => x !== a) : [...p.allergies, a] })}
        />
      )
      break
    case 'liked':
      title = 'Що любить?'
      hint = 'Страви з цими продуктами будуть частіше. Можна пропустити.'
      body = <FoodChips mode="like" person={p} update={update} />
      break
    case 'excluded':
      title = 'Чого не їсть?'
      hint = 'Страв з цими продуктами не буде. Можна пропустити.'
      body = <FoodChips mode="dislike" person={p} update={update} />
      break
  }

  const multi = question === 'allergies' || question === 'liked' || question === 'excluded'
  const empty =
    question === 'allergies' ? p.allergies.length === 0 : question === 'liked' ? !p.likedProducts?.length : p.excludedProducts.length === 0

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
          {last && !(multi && empty) ? finishLabel : multi && empty ? (question === 'allergies' ? 'Немає' : last ? `Пропустити · ${finishLabel.toLowerCase()}` : 'Пропустити') : 'Далі'}
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
  save: 'Без калорій, лише бюджет',
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


/** Everyday foods people usually have an opinion about. One chip can stand for several products. */
const FOODS: { label: string; emoji: string; ids: string[] }[] = [
  { label: 'Курка', emoji: '🍗', ids: ['chicken_fillet', 'chicken_thighs'] },
  { label: 'Свинина', emoji: '🥩', ids: ['pork'] },
  { label: 'Фарш', emoji: '🍖', ids: ['mince'] },
  { label: 'Печінка', emoji: '🫀', ids: ['chicken_liver'] },
  { label: 'Риба', emoji: '🐟', ids: ['hake'] },
  { label: 'Креветки', emoji: '🦐', ids: ['shrimp'] },
  { label: 'Яйця', emoji: '🥚', ids: ['eggs'] },
  { label: 'Сир кисломолочний', emoji: '🥣', ids: ['cottage'] },
  { label: 'Твердий сир', emoji: '🧀', ids: ['cheese'] },
  { label: 'Молоко', emoji: '🥛', ids: ['milk', 'kefir', 'yogurt'] },
  { label: 'Гречка', emoji: '🌾', ids: ['buckwheat'] },
  { label: 'Рис', emoji: '🍚', ids: ['rice'] },
  { label: 'Макарони', emoji: '🍝', ids: ['pasta'] },
  { label: 'Вівсянка', emoji: '🥣', ids: ['oats'] },
  { label: 'Пшоно', emoji: '🌾', ids: ['millet'] },
  { label: 'Картопля', emoji: '🥔', ids: ['potato'] },
  { label: 'Капуста', emoji: '🥬', ids: ['cabbage'] },
  { label: 'Буряк', emoji: '🫜', ids: ['beet'] },
  { label: 'Гриби', emoji: '🍄', ids: ['mushrooms'] },
  { label: 'Броколі', emoji: '🥦', ids: ['broccoli'] },
  { label: 'Кабачок', emoji: '🥒', ids: ['zucchini'] },
  { label: 'Квасоля', emoji: '🫘', ids: ['beans_can'] },
  { label: 'Сочевиця', emoji: '🫘', ids: ['lentils'] },
  { label: 'Нут', emoji: '🧆', ids: ['chickpeas'] },
  { label: 'Тофу', emoji: '🌱', ids: ['tofu'] },
  { label: 'Яблука', emoji: '🍎', ids: ['apple'] },
  { label: 'Банани', emoji: '🍌', ids: ['banana'] },
  { label: 'Мед', emoji: '🍯', ids: ['honey'] },
]
const IN_FOODS = new Set(FOODS.flatMap((f) => f.ids))

function FoodChips({ mode, person: p, update }: { mode: 'like' | 'dislike'; person: Person; update: (patch: Partial<Person>) => void }) {
  const [all, setAll] = useState(false)
  const mine = mode === 'like' ? p.likedProducts ?? [] : p.excludedProducts
  const other = mode === 'like' ? p.excludedProducts : p.likedProducts ?? []
  const set = (ids: string[]) => update(mode === 'like' ? { likedProducts: ids } : { excludedProducts: ids })
  const items = [
    ...FOODS,
    ...(all
      ? PRODUCTS.filter((x) => !IN_FOODS.has(x.id))
          .sort((a, b) => a.name.localeCompare(b.name, 'uk'))
          .map((x) => ({ label: x.name, emoji: '', ids: [x.id] }))
      : []),
  ]
  return (
    <>
      <div className="product-chips">
        {items.map((f) => {
          const on = f.ids.every((id) => mine.includes(id))
          const blocked = f.ids.every((id) => other.includes(id))
          return (
            <button
              key={f.label}
              className={on ? `pchip ${mode}` : 'pchip'}
              aria-pressed={on}
              disabled={blocked}
              onClick={() => set(on ? mine.filter((id) => !f.ids.includes(id)) : [...new Set([...mine, ...f.ids])])}
            >
              {f.emoji && <span aria-hidden>{f.emoji}</span>}
              {f.label}
            </button>
          )
        })}
      </div>
      {!all && <button className="ghost" onClick={() => setAll(true)}>Усі продукти</button>}
    </>
  )
}
