import { useEffect, useMemo, useState } from 'react'
import type { Household } from './domain/types'
import { newPerson } from './domain/people'
import { NoDishesError, planWeek, summarize, swapMeal, type MenuGrid } from './domain/planner'
import { SetupStep } from './ui/SetupStep'
import { PeopleStep } from './ui/PeopleStep'
import { MenuStep } from './ui/MenuStep'
import { SLOT_LABELS } from './ui/labels'

type Step = 'setup' | 'people' | 'menu'

interface Saved {
  step: Step
  household: Household
  grid?: MenuGrid
}

const STORAGE_KEY = 'koshyk-tyzhnia/v1'

const initial: Saved = {
  step: 'setup',
  household: {
    weeklyBudget: 2000,
    store: 'cheapest',
    diet: 'omnivore',
    meals: ['breakfast', 'lunch', 'dinner'],
    people: [newPerson(1)],
    surveyed: false,
  },
}

function load(): Saved {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...initial, ...JSON.parse(raw) } : initial
  } catch {
    return initial
  }
}

export default function App() {
  const [state, setState] = useState<Saved>(load)
  const [error, setError] = useState<string>()
  const { step, household, grid } = state

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable: app still works for this session */
    }
  }, [state])

  const plan = useMemo(() => (grid ? summarize(household, grid) : undefined), [household, grid])

  const setHousehold = (h: Household) => setState((s) => ({ ...s, household: h }))

  function buildMenu(h: Household) {
    try {
      const p = planWeek(h)
      setError(undefined)
      setState({ step: 'menu', household: h, grid: p.grid })
    } catch (e) {
      if (e instanceof NoDishesError)
        setError(`Для «${SLOT_LABELS[e.slot]}» не залишилось страв з такими обмеженнями. Приберіть частину виключень.`)
      else throw e
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="logo" aria-hidden>
            <svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 9h16l-1.6 9.2a2 2 0 0 1-2 1.8H7.6a2 2 0 0 1-2-1.8L4 9Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M8.5 9 11 4M15.5 9 13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </span>
          Кошик тижня
        </div>
        <nav className="steps" aria-label="Кроки">
          {(['setup', 'people', 'menu'] as Step[]).map((s, i) => (
            <button
              key={s}
              className={s === step ? 'step active' : 'step'}
              disabled={s === 'menu' && !grid}
              onClick={() => setState((st) => ({ ...st, step: s }))}
            >
              <span className="num">{i + 1}</span>
              {s === 'setup' ? 'Бюджет' : s === 'people' ? 'Люди' : 'Меню'}
            </button>
          ))}
        </nav>
      </header>

      <main className="content">
        {step === 'setup' && (
          <SetupStep household={household} onChange={setHousehold} onNext={() => setState((s) => ({ ...s, step: 'people' }))} />
        )}
        {step === 'people' && (
          <PeopleStep household={household} onChange={setHousehold} onDone={buildMenu} error={error} />
        )}
        {step === 'menu' && plan && (
          <MenuStep
            household={household}
            plan={plan}
            onRegenerate={() => buildMenu(household)}
            onSwap={(day, slot) => setState((s) => ({ ...s, grid: swapMeal(household, plan.grid, day, slot).grid }))}
          />
        )}
      </main>
    </div>
  )
}
