import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

const ROW = 52
const VISIBLE = 5

interface Props {
  value: number
  min: number
  max: number
  step?: number
  unit: string
  format?: (v: number) => string
  onChange: (v: number) => void
  label: string
}

/** Scroll wheel picker: the row in the middle band is the value. */
export function Wheel({ value, min, max, step = 1, unit, format = String, onChange, label }: Props) {
  const values = useMemo(() => Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => min + i * step), [min, max, step])
  const indexOf = (v: number) => Math.max(0, Math.min(values.length - 1, Math.round((v - min) / step)))
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(indexOf(value))
  const timer = useRef<number>(undefined)

  useLayoutEffect(() => {
    const i = indexOf(value)
    if (ref.current) ref.current.scrollTop = i * ROW
    setActive(i)
    if (values[i] !== value) onChange(values[i])
    // Only on mount: afterwards the wheel itself is the source of the value.
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const onScroll = () => {
    const el = ref.current
    if (!el) return
    const i = Math.max(0, Math.min(values.length - 1, Math.round(el.scrollTop / ROW)))
    setActive(i)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => values[i] !== value && onChange(values[i]), 90)
  }

  const goTo = (i: number) => {
    const j = Math.max(0, Math.min(values.length - 1, i))
    ref.current?.scrollTo({ top: j * ROW, behavior: 'smooth' })
  }

  return (
    <div className="wheel" style={{ height: ROW * VISIBLE }}>
      <div className="wheel-band" style={{ top: ROW * 2, height: ROW }}>
        <span className="wheel-unit">{unit}</span>
      </div>
      <div
        ref={ref}
        className="wheel-scroll"
        role="spinbutton"
        aria-label={label}
        aria-valuenow={values[active]}
        aria-valuemin={min}
        aria-valuemax={max}
        tabIndex={0}
        onScroll={onScroll}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp') { e.preventDefault(); goTo(active - 1) }
          if (e.key === 'ArrowDown') { e.preventDefault(); goTo(active + 1) }
        }}
        style={{ paddingBlock: ROW * 2 }}
      >
        {values.map((v, i) => {
          const d = Math.abs(i - active)
          return (
            <div
              key={v}
              className={d === 0 ? 'wheel-row on' : 'wheel-row'}
              style={{ height: ROW, opacity: d === 0 ? 1 : d === 1 ? 0.45 : 0.18, transform: `scale(${d === 0 ? 1 : d === 1 ? 0.86 : 0.74})` }}
              onClick={() => goTo(i)}
            >
              {format(v)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
