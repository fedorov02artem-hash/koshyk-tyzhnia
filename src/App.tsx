import { useEffect, useMemo, useState } from 'react'
import type { Household } from './domain/types'
import { newPerson } from './domain/people'
import { NoDishesError, planWeek, summarize, swapMeal, type MenuGrid } from './domain/planner'
import { SetupStep } from './ui/SetupStep'
import { PeopleStep } from './ui/PeopleStep'
import { MenuStep, type MenuTab } from './ui/MenuStep'
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
  const [menuTab, setMenuTab] = useState<MenuTab>('week')
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
      setMenuTab('week')
      window.scrollTo(0, 0)
    } catch (e) {
      if (e instanceof NoDishesError)
        setError(`Для «${SLOT_LABELS[e.slot]}» не залишилось страв з такими обмеженнями. Приберіть частину виключень.`)
      else throw e
    }
  }

  const go = (step: Step, menuTab?: MenuTab) => {
    setState((st) => ({ ...st, step }))
    if (menuTab) setMenuTab(menuTab)
    window.scrollTo(0, 0)
  }
  const tabs: { id: MenuTab | 'settings'; label: string; icon: string }[] = [
    { id: 'week', label: 'Тиждень', icon: 'M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1ZM4 9h16M9 4v-2M15 4v-2' },
    { id: 'list', label: 'Покупки', icon: 'M4 9h16l-1.6 9.2a2 2 0 0 1-2 1.8H7.6a2 2 0 0 1-2-1.8L4 9ZM8.5 9 11 4M15.5 9 13 4' },
    { id: 'prices', label: 'Ціни', icon: 'M5 20V11M12 20V5M19 20v-6' },
    { id: 'settings', label: 'Налаштування', icon: 'M4 7h10M18 7h2M4 17h4M12 17h8M14 4v6M8 14v6' },
  ]
  const activeTab = step === 'menu' ? menuTab : 'settings'

  return (
    <div className={grid ? 'app with-tabs' : 'app'}>
      <header className="topbar">
        <div className="brand">
          <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" width="28" height="28" />
          Кошик тижня
        </div>
        {!grid && (
          <nav className="steps" aria-label="Кроки">
            {(['setup', 'people'] as Step[]).map((s, i) => (
              <button key={s} className={s === step ? 'step active' : 'step'} onClick={() => go(s)}>
                <span className="num">{i + 1}</span>
                {s === 'setup' ? 'Бюджет' : 'Люди'}
              </button>
            ))}
          </nav>
        )}
      </header>

      <main className="content">
        {step === 'setup' && <SetupStep household={household} onChange={setHousehold} onNext={() => go('people')} />}
        {step === 'people' && <PeopleStep household={household} onChange={setHousehold} onDone={buildMenu} error={error} />}
        {step === 'menu' && plan && (
          <MenuStep
            household={household}
            plan={plan}
            tab={menuTab}
            onRegenerate={() => buildMenu(household)}
            onSwap={(day, slot) => setState((s) => ({ ...s, grid: swapMeal(household, plan.grid, day, slot).grid }))}
          />
        )}
      </main>

      {grid && (
        <nav className="tabbar" aria-label="Розділи">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={activeTab === t.id ? 'on' : ''}
              onClick={() => (t.id === 'settings' ? go('setup') : go('menu', t.id))}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden><path d={t.icon} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  )
}
