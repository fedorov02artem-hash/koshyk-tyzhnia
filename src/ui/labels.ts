import type { Activity, Allergen, DietStyle, Goal, MealSlot, Sex } from '../domain/types'

export const ALLERGEN_LABELS: Record<Allergen, string> = {
  gluten: 'Глютен',
  milk: 'Молоко / лактоза',
  eggs: 'Яйця',
  nuts: 'Горіхи',
  peanuts: 'Арахіс',
  fish: 'Риба',
  shellfish: 'Морепродукти',
  soy: 'Соя',
  sesame: 'Кунжут',
}

export const DIET_LABELS: Record<DietStyle, { title: string; hint: string }> = {
  omnivore: { title: 'Їм усе', hint: "М'ясо, риба, молочне" },
  vegetarian: { title: 'Вегетаріанське', hint: "Без м'яса і риби" },
  vegan: { title: 'Веганське', hint: 'Лише рослинне, підходить для посту' },
  highProtein: { title: 'Більше білка', hint: 'Для спорту і ситості' },
}

export const SLOT_LABELS: Record<MealSlot, string> = {
  breakfast: 'Сніданок',
  lunch: 'Обід',
  dinner: 'Вечеря',
  snack: 'Перекус',
}

export const SEX_LABELS: Record<Sex, string> = { female: 'Жінка', male: 'Чоловік' }

export const ACTIVITY_LABELS: Record<Activity, string> = {
  low: 'Мало руху',
  light: 'Легка активність',
  moderate: 'Спорт 3–5 разів',
  high: 'Дуже активно',
}

export const GOAL_LABELS: Record<Goal, string> = {
  lose: 'Схуднути',
  keep: 'Тримати вагу',
  gain: 'Набрати масу',
}

export const DAY_NAMES = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота', 'Неділя']

export const uah = (n: number) =>
  new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 }).format(Math.round(n)) + ' ₴'
