import { describe, expect, it } from 'vitest'
import { DISH_BY_ID, DISHES } from './dishes'
import { dailyKcal, dishAllergens, dishFitsDiet } from './nutrition'
import { PRODUCT_BY_ID } from './products'
import { isLeftover, planWeek, swapMeal } from './planner'
import type { Household, Person } from './types'

const adult = (over: Partial<Person> = {}): Person => ({
  name: 'Олена',
  sex: 'female',
  age: 32,
  heightCm: 166,
  weightKg: 62,
  activity: 'light',
  goal: 'keep',
  allergies: [],
  excludedProducts: [],
  ...over,
})

const household = (over: Partial<Household> = {}): Household => ({
  weeklyBudget: 2500,
  stores: ['atb', 'silpo', 'novus'],
  diet: 'omnivore',
  meals: ['breakfast', 'lunch', 'dinner'],
  people: [adult(), adult({ name: 'Андрій', sex: 'male', heightCm: 180, weightKg: 82 })],
  ...over,
})

describe('data', () => {
  it('every ingredient refers to a known product', () => {
    for (const d of DISHES) for (const ing of d.ingredients) expect(PRODUCT_BY_ID[ing.productId], `${d.id}/${ing.productId}`).toBeDefined()
  })
})

describe('calorie norm', () => {
  it('uses Mifflin–St Jeor for adults', () => {
    // 10*62 + 6.25*166 - 5*32 - 161 = 1336.5; ×1.375 = 1837.7
    expect(dailyKcal(adult())).toBe(1840)
  })
  it('applies deficit for weight loss and respects manual norm', () => {
    expect(dailyKcal(adult({ goal: 'lose' }))).toBeLessThan(dailyKcal(adult()))
    expect(dailyKcal(adult({ manualKcal: 2100 }))).toBe(2100)
  })
})

describe('planner', () => {
  it('fills every selected slot for 7 days', () => {
    const plan = planWeek(household(), 1)
    expect(plan.grid).toHaveLength(7)
    for (const day of plan.grid) expect(Object.keys(day).sort()).toEqual(['breakfast', 'dinner', 'lunch'])
  })

  it('never uses dishes with a household allergen or excluded product', () => {
    const h = household({ people: [adult({ allergies: ['gluten', 'milk'] }), adult({ excludedProducts: ['mushrooms'] })] })
    const plan = planWeek(h, 2)
    for (const day of plan.grid)
      for (const id of Object.values(day)) {
        const d = DISH_BY_ID[id!]
        expect(dishAllergens(d).has('gluten')).toBe(false)
        expect(dishAllergens(d).has('milk')).toBe(false)
        expect(d.ingredients.some((i) => i.productId === 'mushrooms')).toBe(false)
      }
  })

  it('never repeats a dish within one day', () => {
    for (let seed = 1; seed < 15; seed++) {
      const plan = planWeek(household({ people: [adult({ allergies: ['gluten'] })] }), seed)
      for (const day of plan.grid) {
        const ids = Object.values(day)
        expect(new Set(ids).size).toBe(ids.length)
      }
    }
  })

  it('respects vegan diet', () => {
    const plan = planWeek(household({ diet: 'vegan', meals: ['breakfast', 'lunch', 'dinner', 'snack'] }), 3)
    for (const day of plan.grid) for (const id of Object.values(day)) expect(dishFitsDiet(DISH_BY_ID[id!], 'vegan')).toBe(true)
  })

  it('stays within a realistic budget for two adults', () => {
    const plan = planWeek(household(), 4)
    expect(plan.overBudget).toBe(0)
    expect(plan.cost).toBeGreaterThan(500)
  })

  it('scales portions to each person', () => {
    const plan = planWeek(household(), 5)
    for (let d = 0; d < 7; d++) {
      expect(Math.abs(plan.kcalPerPerson[d][0] - plan.targets[0])).toBeLessThan(5)
      expect(plan.kcalPerPerson[d][1]).toBeGreaterThan(plan.kcalPerPerson[d][0])
    }
  })

  it('more people cost more', () => {
    const two = planWeek(household({ weeklyBudget: 99999 }), 6)
    const four = planWeek(household({ weeklyBudget: 99999, people: [adult(), adult(), adult(), adult()] }), 6)
    expect(four.cost).toBeGreaterThan(two.cost)
  })

  it('reuses batch dishes as leftovers', () => {
    const plan = planWeek(household(), 7)
    expect(plan.cookCount).toBeLessThan(21)
    let found = false
    for (let d = 0; d < 7; d++) for (const s of ['lunch', 'dinner'] as const) if (isLeftover(plan.grid, d, s)) found = true
    expect(found).toBe(true)
  })

  it('swap changes the chosen meal', () => {
    const h = household()
    const plan = planWeek(h, 8)
    const swapped = swapMeal(h, plan.grid, 2, 'breakfast')
    expect(swapped.grid[2].breakfast).not.toBe(plan.grid[2].breakfast)
  })

  it('cheapest store total is the minimum', () => {
    const plan = planWeek(household(), 9)
    expect(plan.cost).toBe(Math.min(...plan.storeTotals.map((t) => t.total)))
  })
})

describe('variety and kitchen', () => {
  it('has a large dish base for every meal and diet', () => {
    const count = (kind: string, diet: 'omnivore' | 'vegetarian' | 'vegan') => DISHES.filter((d) => d.kind === kind && dishFitsDiet(d, diet)).length
    expect(DISHES.length).toBeGreaterThanOrEqual(110)
    expect(count('breakfast', 'omnivore')).toBeGreaterThanOrEqual(25)
    expect(count('main', 'vegetarian')).toBeGreaterThanOrEqual(15)
    expect(count('main', 'vegan')).toBeGreaterThanOrEqual(8)
  })

  it('a full week with snacks repeats almost nothing', () => {
    const p = planWeek(household({ meals: ['breakfast', 'lunch', 'dinner', 'snack'], weeklyBudget: 4000 }), 7)
    const ids = p.grid.flatMap((d, day) => Object.entries(d).filter(([s]) => !isLeftover(p.grid, day, s as never)).map(([, id]) => id))
    expect(new Set(ids).size).toBeGreaterThanOrEqual(ids.length - 2)
  })

  it('without an oven or air fryer no baked dishes are planned', () => {
    const p = planWeek(household({ kitchen: ['stove'] }), 3)
    for (const d of p.grid) for (const id of Object.values(d)) expect(DISH_BY_ID[id!].tool, id).not.toBe('oven')
  })

  it('with only a microwave the week is built from no-cook and microwave dishes', () => {
    const p = planWeek(household({ kitchen: ['microwave'], meals: ['breakfast', 'snack'] }), 3)
    for (const d of p.grid)
      for (const id of Object.values(d)) {
        const dish = DISH_BY_ID[id!]
        expect(dish.tool === 'none' || dish.micro, id).toBe(true)
      }
  })
})
