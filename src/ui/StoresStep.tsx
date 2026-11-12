import { STORES } from '../domain/products'
import type { StoreId } from '../domain/types'

export const MAX_STORES = 3

/** Our own simple marks in each chain's colour; not the chains' official logos. */
export const STORE_MARK: Record<StoreId, { bg: string; fg: string; mark: string; hint: string }> = {
  atb: { bg: '#1E4FA8', fg: '#FFFFFF', mark: 'АТБ', hint: 'Дискаунтер' },
  silpo: { bg: '#F28C1E', fg: '#FFFFFF', mark: 'С', hint: 'Супермаркет' },
  novus: { bg: '#2E9D48', fg: '#FFFFFF', mark: 'N', hint: 'Супермаркет' },
  auchan: { bg: '#E2231A', fg: '#FFFFFF', mark: 'A', hint: 'Гіпермаркет' },
  varus: { bg: '#F5C400', fg: '#1B1B1A', mark: 'V', hint: 'Супермаркет' },
  fora: { bg: '#8A2BB0', fg: '#FFFFFF', mark: 'Ф', hint: 'Біля дому' },
}

interface Props {
  selected: StoreId[]
  onChange: (stores: StoreId[]) => void
  onNext: () => void
}

export function StoresStep({ selected, onChange, onNext }: Props) {
  const full = selected.length >= MAX_STORES
  const toggle = (id: StoreId) => {
    if (selected.includes(id)) onChange(selected.filter((s) => s !== id))
    else if (!full) onChange([...selected, id])
  }

  return (
    <section className="wizard">
      <div className="question">
        <h1>Де будете купувати?</h1>
        <p className="muted">Оберіть до трьох магазинів. Порахуємо кошик у кожному і підкажемо, де дешевше.</p>
        <div className="store-grid">
          {STORES.map((s) => {
            const on = selected.includes(s.id)
            const m = STORE_MARK[s.id]
            return (
              <button
                key={s.id}
                className={on ? 'store-tile on' : 'store-tile'}
                aria-pressed={on}
                disabled={!on && full}
                onClick={() => toggle(s.id)}
              >
                <span className="store-logo" style={{ background: m.bg, color: m.fg }}>{m.mark}</span>
                <strong>{s.name}</strong>
                <span className="muted small">{m.hint}</span>
                {on && <span className="store-check" aria-hidden>{selected.indexOf(s.id) + 1}</span>}
              </button>
            )
          })}
        </div>
      </div>
      <div className="stack-sm">
        <p className="muted small center">Обрано {selected.length} з {MAX_STORES}</p>
        <button className="primary" disabled={selected.length === 0} onClick={onNext}>Далі</button>
      </div>
    </section>
  )
}
