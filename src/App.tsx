import { useEffect, useMemo, useState } from 'react'
import type { Household } from './domain/types'
import { newPerson } from './domain/people'
import { NoDishesError, planWeek, summarize, swapMeal, type MenuGrid } from './domain/planner'
import { SetupStep } from './ui/SetupStep'
import { PeopleStep } from './ui/PeopleStep'
import { MenuStep, type MenuTab } from './ui/MenuStep'
import { SLOT_LABELS } from './ui/labels'
import { StoresStep } from './ui/StoresStep'
import { HomeScreen } from './ui/HomeScreen'

type Step = 'home' | 'stores' | 'setup' | 'people' | 'menu'

interface Saved {
  step: Step
  household: Household
  grid?: MenuGrid
}

const STORAGE_KEY = 'koshyk-tyzhnia/v2'

const initial: Saved = {
  step: 'home',
  household: {
    weeklyBudget: 2000,
    stores: [],
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
  const [setupQ, setSetupQ] = useState(0)
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
    if (step === 'setup') setSetupQ(0)
    setState((st) => ({ ...st, step }))
    if (menuTab) setMenuTab(menuTab)
    window.scrollTo(0, 0)
  }
  type Tab = 'home' | 'week' | 'list' | 'profile'
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'home', label: 'Головна', icon: 'M4 11 12 4l8 7M6 9.5V20h12V9.5M10 20v-5h4v5' },
    { id: 'week', label: 'Тиждень', icon: 'M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1ZM4 9h16M9 4v-2M15 4v-2' },
    { id: 'list', label: 'Покупки', icon: 'M4 9h16l-1.6 9.2a2 2 0 0 1-2 1.8H7.6a2 2 0 0 1-2-1.8L4 9ZM8.5 9 11 4M15.5 9 13 4' },
    { id: 'profile', label: 'Профіль', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20a7.5 7.5 0 0 1 15 0' },
  ]
  const activeTab: Tab | undefined =
    step === 'home' ? 'home' : step === 'menu' ? (menuTab === 'list' ? 'list' : 'week') : grid ? 'profile' : undefined
  // While setting up for the first time, hide the tabs and show a back arrow instead.
  const onboarding = !grid && (step === 'stores' || step === 'setup' || step === 'people')
  const back: Partial<Record<Step, Step>> = { stores: 'home', setup: 'stores', people: 'setup' }
  const openTab = (t: Tab) => {
    if (t === 'home') go('home')
    else if (t === 'profile') go(grid ? 'setup' : 'home')
    else go(grid ? 'menu' : 'home', t === 'list' ? 'list' : 'week')
  }

  return (
    <div className={onboarding ? 'app' : 'app with-tabs'}>
      <header className="topbar">
        {onboarding ? (
          <button className="icon" aria-label="Назад" onClick={() => {
              if (step === 'setup' && setupQ > 0) setSetupQ(setupQ - 1)
              else if (step === 'people') {
                go('setup')
                setSetupQ(2)
              } else go(back[step] ?? 'home')
            }}>
            <svg viewBox="0 0 24 24" width="22" height="22"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        ) : (
          <div className="brand">
            <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" width="28" height="28" />
            Кошик тижня
          </div>
        )}
        {onboarding && (
          <div className="dots" aria-label="Крок">
            {(['stores', 'setup', 'people'] as Step[]).map((s) => (
              <span key={s} className={s === step ? 'on' : ''} />
            ))}
          </div>
        )}
      </header>

      <main className="content">
        {step === 'home' && (
          <HomeScreen
            household={household}
            plan={plan}
            onStart={() => go('stores')}
            onOpenWeek={() => go('menu', 'week')}
            onRegenerate={() => buildMenu(household)}
          />
        )}
        {step === 'stores' && (
          <StoresStep
            selected={household.stores}
            onChange={(stores) => setHousehold({ ...household, stores })}
            onNext={() => (grid ? buildMenu(household) : go('setup'))}
          />
        )}
        {step === 'setup' && <SetupStep household={household} q={setupQ} setQ={setSetupQ} onChange={setHousehold} onNext={() => go('people')} />}
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

      {!onboarding && (
        <nav className="tabbar" aria-label="Розділи">
          {tabs.map((t) => (
            <button key={t.id} className={activeTab === t.id ? 'on' : ''} onClick={() => openTab(t.id)}>
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden><path d={t.icon} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  )
}
