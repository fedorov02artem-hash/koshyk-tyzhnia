import { useState } from 'react'

export interface TileOption<T extends string> {
  value: T
  title: string
  emoji: string
  hint?: string
}

/** Two-column picture tiles. Used for single choice (one selected) and multi choice. */
export function Tiles<T extends string>({ options, selected, onToggle, compact }: { options: TileOption<T>[]; selected: T[]; onToggle: (v: T) => void; compact?: boolean }) {
  return (
    <div className={compact ? 'tiles compact' : 'tiles'}>
      {options.map((o) => {
        const on = selected.includes(o.value)
        return (
          <button key={o.value} className={on ? 'tile on' : 'tile'} aria-pressed={on} onClick={() => onToggle(o.value)}>
            {on && <span className="tile-check" aria-hidden>✓</span>}
            <Art emoji={o.emoji} className="tile-art" />
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
  goal: { save: '🍽️', lose: '🥗', keep: '⚖️', gain: '💪' },
  diet: { omnivore: '🍗', vegetarian: '🧀', vegan: '🥦', highProtein: '🥩' },
  allergen: { gluten: '🍞', milk: '🥛', eggs: '🥚', nuts: '🌰', peanuts: '🥜', fish: '🐟', shellfish: '🦐', soy: '🫘', sesame: '🥯' },
  meal: { breakfast: '🍳', lunch: '🍲', dinner: '🍝', snack: '🍎' },
} as const

/** 3D picture for an emoji (Microsoft Fluent Emoji, MIT), falling back to the emoji itself. */
export function artUrl(emoji: string) {
  const key = Array.from(emoji)
    .map((c) => c.codePointAt(0)!.toString(16))
    .filter((c) => c !== 'fe0f')
    .join('-')
  return `${import.meta.env.BASE_URL}art/${key}.webp`
}

export function Art({ emoji, className }: { emoji: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <span className={className} aria-hidden>{emoji}</span>
  return <img className={className + ' art-img'} src={artUrl(emoji)} alt="" aria-hidden onError={() => setFailed(true)} />
}
