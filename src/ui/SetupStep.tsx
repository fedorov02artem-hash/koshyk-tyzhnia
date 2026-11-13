import { SLOT_ORDER } from '../domain/planner'
import type { Appliance, DietStyle, Household, MealSlot } from '../domain/types'
import { APPLIANCE_LABELS, DIET_LABELS, SLOT_LABELS } from './labels'
import { uah } from './labels'
import { Wheel } from './Wheel'
import { EMOJI, Tiles } from './Tiles'

export const SETUP_QUESTIONS = ['budget', 'diet', 'meals', 'kitchen'] as const
const ALL_APPLIANCES = Object.keys(APPLIANCE_LABELS) as Appliance[]

interface Props {
  household: Household
  q: number
  setQ: (q: number) => void
  onChange: (h: Household) => void
  onNext: () => void
}

/** Budget, diet style and meals, one question per screen. */
export function SetupStep({ household: h, q, setQ, onChange, onNext }: Props) {
  const question = SETUP_QUESTIONS[q]
  const next = () => (q === SETUP_QUESTIONS.length - 1 ? onNext() : setQ(q + 1))

  const toggleMeal = (slot: MealSlot) => {
    const meals = h.meals.includes(slot) ? h.meals.filter((m) => m !== slot) : [...h.meals, slot]
    if (meals.length) onChange({ ...h, meals })
  }

  let title = ''
  let hint = ''
  let body = null
  let showNext = true
  let canNext = true

  if (question === 'kitchen') {
    const kitchen = h.kitchen ?? ALL_APPLIANCES
    title = 'Що є на кухні?'
    hint = 'Підберемо страви, які ви точно зможете приготувати.'
    body = (
      <Tiles
        compact
        options={ALL_APPLIANCES.map((a) => ({ value: a, title: APPLIANCE_LABELS[a], emoji: EMOJI.appliance[a] }))}
        selected={kitchen}
        onToggle={(a) => onChange({ ...h, kitchen: kitchen.includes(a) ? kitchen.filter((x) => x !== a) : [...kitchen, a] })}
      />
    )
    canNext = kitchen.length > 0
  } else if (question === 'budget') {
    title = 'Скільки готові витратити на тиждень?'
    hint = 'На продукти для всіх, хто їстиме.'
    body = (
      <>
        <Wheel
          label="Бюджет на тиждень"
          value={h.weeklyBudget}
          min={300}
          max={10000}
          step={100}
          unit="₴"
          format={(v) => new Intl.NumberFormat('uk-UA').format(v)}
          onChange={(weeklyBudget) => onChange({ ...h, weeklyBudget })}
        />
        <p className="muted small wheel-caption">≈ {uah(h.weeklyBudget / 7)} на день · гортайте вгору чи вниз</p>
      </>
    )
    canNext = h.weeklyBudget > 0
  } else if (question === 'diet') {
    title = 'Як ви харчуєтесь?'
    hint = 'Підберемо страви під ваш стиль.'
    body = (
      <Tiles
        options={(Object.keys(DIET_LABELS) as DietStyle[]).map((d) => ({ value: d, title: DIET_LABELS[d].title, hint: DIET_LABELS[d].hint, emoji: EMOJI.diet[d] }))}
        selected={[h.diet]}
        onToggle={(diet) => {
          onChange({ ...h, diet })
          next()
        }}
      />
    )
    showNext = false
  } else {
    title = 'Які прийоми їжі планувати?'
    hint = 'Оберіть усе, що потрібно. Супи й рагу готуються одразу на два дні.'
    body = (
      <Tiles
        options={SLOT_ORDER.map((m) => ({ value: m, title: SLOT_LABELS[m], emoji: EMOJI.meal[m] }))}
        selected={h.meals}
        onToggle={toggleMeal}
      />
    )
  }

  return (
    <section className="wizard">
      <div className="progress" aria-label={`Питання ${q + 1} з ${SETUP_QUESTIONS.length}`}>
        <span style={{ width: `${((q + 1) / SETUP_QUESTIONS.length) * 100}%` }} />
      </div>
      <div className="question" key={question}>
        <h1>{title}</h1>
        <p className="muted">{hint}</p>
        <div className="answer">{body}</div>
      </div>
      {showNext && (
        <button className="primary" disabled={!canNext} onClick={next}>
          {q === SETUP_QUESTIONS.length - 1 ? 'Далі: хто їстиме' : 'Далі'}
        </button>
      )}
    </section>
  )
}
