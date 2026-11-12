export type Allergen =
  | 'gluten'
  | 'milk'
  | 'eggs'
  | 'nuts'
  | 'peanuts'
  | 'fish'
  | 'shellfish'
  | 'soy'
  | 'sesame'

/** Animal-origin flags, used to derive which diets a dish fits. */
export type Origin = 'meat' | 'fish' | 'dairy' | 'egg' | 'honey'

export type DietStyle = 'omnivore' | 'vegetarian' | 'vegan' | 'highProtein'

export type Department =
  | 'veg'
  | 'fruit'
  | 'grocery'
  | 'bakery'
  | 'dairy'
  | 'meat'
  | 'fish'
  | 'frozen'

export type StoreId = 'atb' | 'silpo' | 'novus' | 'auchan' | 'varus' | 'fora'

export interface Product {
  id: string
  name: string
  department: Department
  /** Pack size in grams (ml counted as grams). */
  packGrams: number
  /** Human label of the pack, e.g. "1 кг", "10 шт", "0,9 л". */
  packLabel: string
  /** Base pack price in ₴ before per-store adjustment. */
  basePrice: number
  /** Per 100 g. */
  kcal: number
  protein: number
  fat: number
  carbs: number
  allergens?: Allergen[]
  origin?: Origin[]
}

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack'

/** breakfast and snack map to slots directly; soup fits lunch; main fits lunch and dinner. */
export type DishKind = 'breakfast' | 'soup' | 'main' | 'snack'

export interface Ingredient {
  productId: string
  /** Grams for one standard portion. */
  grams: number
}

export interface Dish {
  id: string
  name: string
  kind: DishKind
  minutes: number
  /** Can be cooked once and eaten two days in a row. */
  batch?: boolean
  ingredients: Ingredient[]
}

export type Sex = 'male' | 'female'
export type Activity = 'low' | 'light' | 'moderate' | 'high'
/** 'save' = no health goal, only saving money: calories are not shown for this person. */
export type Goal = 'save' | 'lose' | 'keep' | 'gain'

export interface Person {
  name: string
  sex: Sex
  age: number
  heightCm: number
  weightKg: number
  activity: Activity
  goal: Goal
  /** If set, overrides the calculated norm. */
  manualKcal?: number
  allergies: Allergen[]
  excludedProducts: string[]
  /** Favourite products: dishes with them are picked more often. */
  likedProducts?: string[]
}

export interface Household {
  weeklyBudget: number
  /** Up to three stores the household shops at. The plan is priced at the cheapest of them. */
  stores: StoreId[]
  diet: DietStyle
  meals: MealSlot[]
  people: Person[]
  /** Questionnaire completed for the current number of people. */
  surveyed?: boolean
}
