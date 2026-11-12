import { SLOT_ORDER } from '../domain/planner'
import type { DietStyle, Household, MealSlot } from '../domain/types'
import { DIET_LABELS, SLOT_LABELS } from './labels'
import { BigNumber } from './PeopleStep'
import { EMOJI, Tiles } from './Tiles'

export const SETUP_QUESTIONS = ['budget', 'diet', 'meals'] as const

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

  if (question === 'budget') {
    title = 'Скільки готові витратити на тиждень?'
    hint = 'На продукти для всіх, хто їстиме.'
    body = (
      <>
        <BigNumber autoFocus value={h.weeklyBudget} unit="₴" onChange={(weeklyBudget) => onChange({ ...h, weeklyBudget })} onEnter={next} />
        <div className="chips">
          {[1000, 1500, 2000, 3000, 4000].map((v) => (
            <button key={v} className={v === h.weeklyBudget ? 'chip on' : 'chip'} onClick={() => onChange({ ...h, weeklyBudget: v })}>
              {v} ₴
            </button>
          ))}
        </div>
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
          {question === 'meals' ? 'Далі: хто їстиме' : 'Далі'}
        </button>
      )}
    </section>
  )
}
