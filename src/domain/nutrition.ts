import { PRODUCT_BY_ID } from './products'
import type { Activity, Allergen, Appliance, DietStyle, Dish, Goal, Person } from './types'

export interface Nutrition {
  kcal: number
  protein: number
  fat: number
  carbs: number
}

export const ZERO: Nutrition = { kcal: 0, protein: 0, fat: 0, carbs: 0 }

export function addNutrition(a: Nutrition, b: Nutrition, k = 1): Nutrition {
  return {
    kcal: a.kcal + b.kcal * k,
    protein: a.protein + b.protein * k,
    fat: a.fat + b.fat * k,
    carbs: a.carbs + b.carbs * k,
  }
}

/** Nutrition of one standard portion. */
export function dishNutrition(dish: Dish): Nutrition {
  return dish.ingredients.reduce((acc, ing) => {
    const p = PRODUCT_BY_ID[ing.productId]
    return addNutrition(acc, p, ing.grams / 100)
  }, ZERO)
}

export function dishAllergens(dish: Dish): Set<Allergen> {
  const out = new Set<Allergen>()
  for (const ing of dish.ingredients) PRODUCT_BY_ID[ing.productId].allergens?.forEach((a) => out.add(a))
  return out
}

export function dishFitsDiet(dish: Dish, diet: DietStyle): boolean {
  const origins = new Set(dish.ingredients.flatMap((ing) => PRODUCT_BY_ID[ing.productId].origin ?? []))
  if (diet === 'vegetarian') return !origins.has('meat') && !origins.has('fish')
  if (diet === 'vegan') return origins.size === 0
  return true
}

/** Share of calories coming from protein, 0..1. */
export function proteinShare(n: Nutrition): number {
  return n.kcal > 0 ? (n.protein * 4) / n.kcal : 0
}

/** Can anyone in the household eat this dish? Allergies and excluded products of all people count. */
/** Can this dish be made with the appliances at home? */
export function dishCookable(dish: Dish, kitchen?: Appliance[]): boolean {
  if (!kitchen) return true
  const has = (a: Appliance) => kitchen.includes(a)
  const hob = has('stove') || has('multicooker')
  const micro = !!dish.micro && has('microwave')
  switch (dish.tool ?? 'stove') {
    case 'none':
      return true
    case 'stove':
      return hob || micro
    case 'oven':
      return has('oven') || has('airfryer') || micro
    case 'blender':
      return has('blender') && (dish.kind === 'snack' || hob)
  }
}

export function dishAllowed(dish: Dish, people: Person[], diet: DietStyle, kitchen?: Appliance[]): boolean {
  if (!dishFitsDiet(dish, diet)) return false
  if (!dishCookable(dish, kitchen)) return false
  const allergens = dishAllergens(dish)
  for (const person of people) {
    if (person.allergies.some((a) => allergens.has(a))) return false
    if (dish.ingredients.some((ing) => person.excludedProducts.includes(ing.productId))) return false
  }
  return true
}

const ACTIVITY_FACTOR: Record<Activity, number> = { low: 1.2, light: 1.375, moderate: 1.55, high: 1.725 }
const GOAL_FACTOR: Record<Goal, number> = { save: 1, lose: 0.85, keep: 1, gain: 1.12 }

/**
 * Daily calorie norm. Adults: Mifflin–St Jeor × activity × goal.
 * Under 18 a simple age-based estimate is used, and weight-loss deficits are not applied.
 */
export function dailyKcal(person: Person): number {
  if (person.goal !== 'save' && person.manualKcal && person.manualKcal > 0) return Math.round(person.manualKcal)
  if (person.age < 18) {
    const base = Math.min(1000 + 100 * Math.max(person.age, 1), person.sex === 'male' ? 2800 : 2300)
    const activity = ACTIVITY_FACTOR[person.activity] / ACTIVITY_FACTOR.light
    return Math.round((base * activity) / 10) * 10
  }
  const bmr = 10 * person.weightKg + 6.25 * person.heightCm - 5 * person.age + (person.sex === 'male' ? 5 : -161)
  const kcal = bmr * ACTIVITY_FACTOR[person.activity] * GOAL_FACTOR[person.goal]
  return Math.round(Math.max(kcal, person.sex === 'male' ? 1500 : 1200) / 10) * 10
}

/** Calories matter to this household only if someone has a health goal. */
export const tracksCalories = (people: Person[]) => people.some((p) => p.goal !== 'save')
