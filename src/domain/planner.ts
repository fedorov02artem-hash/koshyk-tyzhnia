import { DISHES, DISH_BY_ID } from './dishes'
import { addNutrition, dailyKcal, dishAllowed, dishNutrition, proteinShare, ZERO, type Nutrition } from './nutrition'
import { packPrice, PRODUCT_BY_ID, STORES } from './products'
import type { Dish, Household, MealSlot, StoreId } from './types'

export const DAYS = 7
export const SLOT_ORDER: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'snack']

/** grid[day][slot] = dish id */
export type MenuGrid = Partial<Record<MealSlot, string>>[]

export interface ShoppingItem {
  productId: string
  grams: number
  packs: number
}

export interface StoreTotal {
  store: StoreId
  /** What you pay at the till: whole packs. */
  total: number
}

export interface PlanSummary {
  grid: MenuGrid
  /** Portion multiplier per day per person (1 = standard portion). */
  portions: number[][]
  /** Calories each person actually gets per day. */
  kcalPerPerson: number[][]
  targets: number[]
  shopping: ShoppingItem[]
  storeTotals: StoreTotal[]
  store: StoreId
  cost: number
  overBudget: number
  /** Number of times a dish is cooked (leftover days do not count). */
  cookCount: number
  /** Price of the ingredients each meal uses, for everyone, at the chosen store (by weight, not whole packs). */
  mealCosts: Partial<Record<MealSlot, number>>[]
}

function pools(h: Household): Record<MealSlot, Dish[]> {
  const allowed = DISHES.filter((d) => dishAllowed(d, h.people, h.diet, h.kitchen))
  return {
    breakfast: allowed.filter((d) => d.kind === 'breakfast'),
    lunch: allowed.filter((d) => d.kind === 'soup' || d.kind === 'main'),
    dinner: allowed.filter((d) => d.kind === 'main'),
    snack: allowed.filter((d) => d.kind === 'snack'),
  }
}

/** True if this slot just reuses the previous day's batch-cooked dish. */
export function isLeftover(grid: MenuGrid, day: number, slot: MealSlot): boolean {
  if (day === 0) return false
  const id = grid[day][slot]
  if (!id || grid[day - 1][slot] !== id || !DISH_BY_ID[id].batch) return false
  return !isLeftover(grid, day - 1, slot)
}

function slotsOf(h: Household): MealSlot[] {
  return SLOT_ORDER.filter((s) => h.meals.includes(s))
}

export function summarize(h: Household, grid: MenuGrid): PlanSummary {
  const slots = slotsOf(h)
  const targets = h.people.map(dailyKcal)
  const grams = new Map<string, number>()
  const portions: number[][] = []
  const kcalPerPerson: number[][] = []
  let cookCount = 0

  for (let day = 0; day < grid.length; day++) {
    const dishes = slots.map((s) => grid[day][s]).filter(Boolean).map((id) => DISH_BY_ID[id!])
    const dayStd = dishes.reduce((sum, d) => sum + dishNutrition(d).kcal, 0)
    const factors = targets.map((t) => clamp(dayStd > 0 ? t / dayStd : 1, 0.4, 2.5))
    portions.push(factors)
    kcalPerPerson.push(factors.map((f) => Math.round(f * dayStd)))
    const servings = factors.reduce((a, b) => a + b, 0)
    for (const slot of slots) {
      const id = grid[day][slot]
      if (!id) continue
      if (!isLeftover(grid, day, slot)) cookCount++
      for (const ing of DISH_BY_ID[id].ingredients) {
        grams.set(ing.productId, (grams.get(ing.productId) ?? 0) + ing.grams * servings)
      }
    }
  }

  const shopping: ShoppingItem[] = [...grams].map(([productId, g]) => ({
    productId,
    grams: Math.round(g),
    packs: Math.ceil(g / PRODUCT_BY_ID[productId].packGrams - 1e-9),
  }))

  const chosen = STORES.filter((s) => h.stores.length === 0 || h.stores.includes(s.id))
  const storeTotals = chosen.map((s) => ({
    store: s.id,
    total: round2(shopping.reduce((sum, it) => sum + it.packs * packPrice(it.productId, s.id), 0)),
  })).sort((a, b) => a.total - b.total)

  const store = storeTotals[0].store
  const cost = storeTotals.find((t) => t.store === store)!.total

  const mealCosts = grid.map((day, d) => {
    const servings = portions[d].reduce((a, b) => a + b, 0)
    const row: Partial<Record<MealSlot, number>> = {}
    for (const slot of slots) {
      const id = day[slot]
      if (!id) continue
      row[slot] = round2(
        DISH_BY_ID[id].ingredients.reduce(
          (sum, ing) => sum + ((ing.grams * servings) / PRODUCT_BY_ID[ing.productId].packGrams) * packPrice(ing.productId, store),
          0,
        ),
      )
    }
    return row
  })

  return {
    grid,
    portions,
    kcalPerPerson,
    targets,
    shopping,
    storeTotals,
    store,
    cost,
    overBudget: Math.max(0, round2(cost - h.weeklyBudget)),
    cookCount,
    mealCosts,
  }
}

/** Average nutrition of one standard day of the menu. */
export function averageDay(h: Household, grid: MenuGrid): Nutrition {
  let total = ZERO
  for (const day of grid) for (const s of slotsOf(h)) if (day[s]) total = addNutrition(total, dishNutrition(DISH_BY_ID[day[s]!]))
  return addNutrition(ZERO, total, 1 / Math.max(grid.length, 1))
}

function score(h: Household, grid: MenuGrid): number {
  const s = summarize(h, grid)
  const uses = new Map<string, number>()
  let backToBack = 0
  for (let day = 0; day < grid.length; day++)
    for (const slot of slotsOf(h)) {
      const id = grid[day][slot]
      if (!id || isLeftover(grid, day, slot)) continue
      uses.set(id, (uses.get(id) ?? 0) + 1)
      // Same dish again the next day without being a planned leftover feels monotonous.
      if (day > 0 && Object.values(grid[day - 1]).includes(id)) backToBack++
    }
  // Favourite products: each planned dish that has one counts as a small win.
  const liked = new Set(h.people.flatMap((p) => p.likedProducts ?? []))
  let favourites = 0
  if (liked.size)
    for (const [id, n] of uses) if (DISH_BY_ID[id].ingredients.some((ing) => liked.has(ing.productId))) favourites += n
  const repeats = [...uses.values()].reduce((a, n) => a + Math.max(0, n - 1), 0)
  let value = s.overBudget * 10 + repeats * 60 + backToBack * 400 + s.cost * 0.05 + s.cookCount * 3 - favourites * 25
  if (h.diet === 'highProtein') value -= proteinShare(averageDay(h, grid)) * 3000
  return value
}

export type Rng = () => number

export function seededRng(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pick = <T,>(arr: T[], rng: Rng): T => arr[Math.floor(rng() * arr.length)]

function randomGrid(h: Household, p: Record<MealSlot, Dish[]>, rng: Rng): MenuGrid {
  const grid: MenuGrid = []
  const slots = slotsOf(h)
  for (let day = 0; day < DAYS; day++) {
    const row: Partial<Record<MealSlot, string>> = {}
    for (const slot of slots) {
      const prev = day > 0 ? grid[day - 1][slot] : undefined
      // Cook batch dishes once for two days.
      if (prev && DISH_BY_ID[prev].batch && !isLeftover(grid, day - 1, slot) && rng() < 0.8) {
        row[slot] = prev
        continue
      }
      const options = p[slot].filter((d) => !Object.values(row).includes(d.id))
      if (options.length) row[slot] = pick(options, rng).id
    }
    grid.push(row)
  }
  return grid
}

export class NoDishesError extends Error {
  slot: MealSlot
  constructor(slot: MealSlot) {
    super(`No dishes left for ${slot}`)
    this.slot = slot
  }
}

/** Builds a 7-day menu: random restarts, then hill-climbing on single-slot swaps. */
export function planWeek(h: Household, seed = Date.now()): PlanSummary {
  const rng = seededRng(seed)
  const p = pools(h)
  for (const slot of slotsOf(h)) if (p[slot].length === 0) throw new NoDishesError(slot)

  let best = randomGrid(h, p, rng)
  let bestScore = score(h, best)
  for (let k = 0; k < 60; k++) {
    const g = randomGrid(h, p, rng)
    const sc = score(h, g)
    if (sc < bestScore) [best, bestScore] = [g, sc]
  }
  const slots = slotsOf(h)
  for (let k = 0; k < 800; k++) {
    const day = Math.floor(rng() * DAYS)
    const slot = pick(slots, rng)
    const g = best.map((r) => ({ ...r }))
    // Half the time try copying a neighbour (batch cooking), otherwise a random dish.
    const neighbour = day > 0 ? best[day - 1][slot] : undefined
    const candidate = neighbour && rng() < 0.3 ? neighbour : pick(p[slot], rng).id
    // Never the same dish twice in one day.
    if (Object.entries(g[day]).some(([s, id]) => s !== slot && id === candidate)) continue
    g[day][slot] = candidate
    const sc = score(h, g)
    if (sc <= bestScore) [best, bestScore] = [g, sc]
  }
  return summarize(h, best)
}

/** Replace one meal with the best alternative not already on that day. */
export function swapMeal(h: Household, grid: MenuGrid, day: number, slot: MealSlot, rng: Rng = Math.random): PlanSummary {
  const p = pools(h)
  const current = grid[day][slot]
  const options = p[slot].filter((d) => d.id !== current && !Object.values(grid[day]).includes(d.id))
  if (!options.length) return summarize(h, grid)
  // Try a handful of random candidates and keep the one that fits the budget best.
  let bestGrid = grid
  let bestScore = Infinity
  for (let k = 0; k < Math.min(6, options.length); k++) {
    const g = grid.map((r) => ({ ...r }))
    g[day][slot] = pick(options, rng).id
    const sc = score(h, g)
    if (sc < bestScore) [bestGrid, bestScore] = [g, sc]
  }
  return summarize(h, bestGrid)
}

function clamp(x: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, x))
}
function round2(x: number) {
  return Math.round(x * 100) / 100
}
