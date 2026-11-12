import type { PlanSummary } from '../domain/planner'
import { STORES } from '../domain/products'
import type { Household } from '../domain/types'
import { Prices } from './MenuStep'
import { StoreLogo } from './StoresStep'
import { uah } from './labels'

interface Props {
  household: Household
  plan?: PlanSummary
  onStart: () => void
  onOpenWeek: () => void
  onRegenerate: () => void
}

export function HomeScreen({ household: h, plan, onStart, onOpenWeek, onRegenerate }: Props) {
  if (!plan) {
    return (
      <section className="home-hero">
        <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" className="hero-icon" />
        <h1>Кошик тижня</h1>
        <p className="muted">Меню на 7 днів у межах вашого бюджету. З калоріями під кожного і цінами з українських магазинів.</p>
        <ul className="hero-points">
          <li><span>1</span>Оберіть магазини</li>
          <li><span>2</span>Вкажіть бюджет і хто їстиме</li>
          <li><span>3</span>Отримайте меню і список покупок</li>
        </ul>
        <button className="primary big" onClick={onStart}>Почати</button>
      </section>
    )
  }
  return (
    <section className="stack">
      <div className="page-head">
        <h1>Головна</h1>
      </div>
      <button className="week-banner" onClick={onOpenWeek}>
        <div>
          <span className="small">Меню на тиждень готове</span>
          <strong>{uah(plan.cost)}</strong>
          <span className="small">на {h.people.length} {h.people.length === 1 ? 'особу' : 'осіб'} · {h.meals.length} прийоми їжі</span>
        </div>
        <span className="arrow" aria-hidden>→</span>
      </button>
      <div className="store-row">
        {h.stores.map((id) => (
          <span key={id} title={STORES.find((s) => s.id === id)!.name}><StoreLogo id={id} small /></span>
        ))}
        <button className="ghost" onClick={onStart}>Змінити</button>
      </div>
      <Prices household={h} plan={plan} onRegenerate={onRegenerate} />
    </section>
  )
}
