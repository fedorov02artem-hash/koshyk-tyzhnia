import type { Person } from './types'

export const newPerson = (n: number): Person => ({
  name: `Людина ${n}`,
  sex: n % 2 ? 'female' : 'male',
  age: 30,
  heightCm: n % 2 ? 165 : 178,
  weightKg: n % 2 ? 62 : 78,
  activity: 'light',
  goal: 'keep',
  allergies: [],
  excludedProducts: [],
})
