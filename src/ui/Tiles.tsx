export interface TileOption<T extends string> {
  value: T
  title: string
  emoji: string
  hint?: string
}

/** Two-column picture tiles. Used for single choice (one selected) and multi choice. */
export function Tiles<T extends string>({ options, selected, onToggle }: { options: TileOption<T>[]; selected: T[]; onToggle: (v: T) => void }) {
  return (
    <div className="tiles">
      {options.map((o) => {
        const on = selected.includes(o.value)
        return (
          <button key={o.value} className={on ? 'tile on' : 'tile'} aria-pressed={on} onClick={() => onToggle(o.value)}>
            {on && <span className="tile-check" aria-hidden>✓</span>}
            <span className="tile-art" aria-hidden>{o.emoji}</span>
            <strong>{o.title}</strong>
            {o.hint && <span className="tile-hint">{o.hint}</span>}
          </button>
        )
      })}
    </div>
  )
}

export const EMOJI = {
  sex: { female: '👩', male: '👨' },
  activity: { low: '🛋️', light: '🚶', moderate: '🏃', high: '🏋️' },
  goal: { lose: '🥗', keep: '⚖️', gain: '💪' },
  diet: { omnivore: '🍗', vegetarian: '🧀', vegan: '🥦', highProtein: '🥩' },
  allergen: { gluten: '🍞', milk: '🥛', eggs: '🥚', nuts: '🌰', peanuts: '🥜', fish: '🐟', shellfish: '🦐', soy: '🫘', sesame: '🥯' },
  meal: { breakfast: '🍳', lunch: '🍲', dinner: '🍝', snack: '🍎' },
} as const
