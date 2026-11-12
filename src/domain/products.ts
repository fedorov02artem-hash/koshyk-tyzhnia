import type { Department, Product, StoreId } from './types'

/**
 * Approximate shelf prices in ₴ (autumn 2026), used until live prices are connected.
 * Nutrition values are per 100 g.
 */
export const PRODUCTS: Product[] = [
  // Grocery
  { id: 'buckwheat', name: 'Гречка', department: 'grocery', packGrams: 1000, packLabel: '1 кг', basePrice: 58, kcal: 343, protein: 12.6, fat: 3.3, carbs: 62 },
  { id: 'rice', name: 'Рис', department: 'grocery', packGrams: 1000, packLabel: '1 кг', basePrice: 68, kcal: 344, protein: 6.7, fat: 0.7, carbs: 78 },
  { id: 'oats', name: 'Вівсяні пластівці', department: 'grocery', packGrams: 500, packLabel: '500 г', basePrice: 32, kcal: 366, protein: 12, fat: 6, carbs: 62, allergens: ['gluten'] },
  { id: 'pasta', name: 'Макарони', department: 'grocery', packGrams: 500, packLabel: '500 г', basePrice: 34, kcal: 350, protein: 11, fat: 1.3, carbs: 71, allergens: ['gluten'] },
  { id: 'flour', name: 'Борошно пшеничне', department: 'grocery', packGrams: 1000, packLabel: '1 кг', basePrice: 30, kcal: 334, protein: 10, fat: 1.1, carbs: 70, allergens: ['gluten'] },
  { id: 'millet', name: 'Пшоно', department: 'grocery', packGrams: 1000, packLabel: '1 кг', basePrice: 42, kcal: 342, protein: 11.5, fat: 3.3, carbs: 66 },
  { id: 'bulgur', name: 'Булгур', department: 'grocery', packGrams: 500, packLabel: '500 г', basePrice: 48, kcal: 342, protein: 12.3, fat: 1.3, carbs: 64, allergens: ['gluten'] },
  { id: 'lentils', name: 'Сочевиця червона', department: 'grocery', packGrams: 500, packLabel: '500 г', basePrice: 58, kcal: 314, protein: 24, fat: 1.5, carbs: 48 },
  { id: 'chickpeas', name: 'Нут', department: 'grocery', packGrams: 500, packLabel: '500 г', basePrice: 58, kcal: 364, protein: 19, fat: 6, carbs: 61 },
  { id: 'beans_can', name: 'Квасоля консервована', department: 'grocery', packGrams: 400, packLabel: '400 г', basePrice: 42, kcal: 99, protein: 6.7, fat: 0.3, carbs: 17 },
  { id: 'oil', name: 'Олія соняшникова', department: 'grocery', packGrams: 850, packLabel: '0,85 л', basePrice: 78, kcal: 899, protein: 0, fat: 99.9, carbs: 0 },
  { id: 'tomato_paste', name: 'Томатна паста', department: 'grocery', packGrams: 70, packLabel: '70 г', basePrice: 19, kcal: 99, protein: 4.8, fat: 0, carbs: 19 },
  { id: 'honey', name: 'Мед', department: 'grocery', packGrams: 250, packLabel: '250 г', basePrice: 95, kcal: 304, protein: 0.8, fat: 0, carbs: 81, origin: ['honey'] },
  { id: 'walnuts', name: 'Волоські горіхи', department: 'grocery', packGrams: 200, packLabel: '200 г', basePrice: 75, kcal: 654, protein: 15, fat: 65, carbs: 7, allergens: ['nuts'] },
  { id: 'peanut_butter', name: 'Арахісова паста', department: 'grocery', packGrams: 300, packLabel: '300 г', basePrice: 98, kcal: 588, protein: 25, fat: 50, carbs: 20, allergens: ['peanuts'] },
  { id: 'soy_sauce', name: 'Соєвий соус', department: 'grocery', packGrams: 150, packLabel: '150 мл', basePrice: 42, kcal: 53, protein: 8, fat: 0.6, carbs: 5, allergens: ['soy', 'gluten'] },
  { id: 'sesame', name: 'Кунжут', department: 'grocery', packGrams: 100, packLabel: '100 г', basePrice: 35, kcal: 573, protein: 18, fat: 50, carbs: 23, allergens: ['sesame'] },

  // Bakery
  { id: 'bread', name: 'Хліб', department: 'bakery', packGrams: 600, packLabel: '600 г', basePrice: 36, kcal: 250, protein: 8, fat: 2, carbs: 49, allergens: ['gluten'] },

  // Vegetables
  { id: 'potato', name: 'Картопля', department: 'veg', packGrams: 1000, packLabel: '1 кг', basePrice: 24, kcal: 77, protein: 2, fat: 0.1, carbs: 17 },
  { id: 'carrot', name: 'Морква', department: 'veg', packGrams: 1000, packLabel: '1 кг', basePrice: 22, kcal: 41, protein: 0.9, fat: 0.2, carbs: 10 },
  { id: 'onion', name: 'Цибуля', department: 'veg', packGrams: 1000, packLabel: '1 кг', basePrice: 24, kcal: 40, protein: 1.1, fat: 0.1, carbs: 9 },
  { id: 'beet', name: 'Буряк', department: 'veg', packGrams: 1000, packLabel: '1 кг', basePrice: 22, kcal: 43, protein: 1.6, fat: 0.2, carbs: 10 },
  { id: 'cabbage', name: 'Капуста', department: 'veg', packGrams: 1000, packLabel: '1 кг', basePrice: 20, kcal: 25, protein: 1.3, fat: 0.1, carbs: 6 },
  { id: 'tomato', name: 'Помідори', department: 'veg', packGrams: 1000, packLabel: '1 кг', basePrice: 95, kcal: 18, protein: 0.9, fat: 0.2, carbs: 3.9 },
  { id: 'cucumber', name: 'Огірки', department: 'veg', packGrams: 1000, packLabel: '1 кг', basePrice: 85, kcal: 15, protein: 0.7, fat: 0.1, carbs: 3.6 },
  { id: 'pepper', name: 'Перець солодкий', department: 'veg', packGrams: 1000, packLabel: '1 кг', basePrice: 125, kcal: 27, protein: 1, fat: 0.3, carbs: 6 },
  { id: 'zucchini', name: 'Кабачок', department: 'veg', packGrams: 1000, packLabel: '1 кг', basePrice: 48, kcal: 17, protein: 1.2, fat: 0.3, carbs: 3.1 },
  { id: 'garlic', name: 'Часник', department: 'veg', packGrams: 100, packLabel: '100 г', basePrice: 16, kcal: 149, protein: 6.4, fat: 0.5, carbs: 33 },
  { id: 'mushrooms', name: 'Печериці', department: 'veg', packGrams: 500, packLabel: '500 г', basePrice: 58, kcal: 22, protein: 3.1, fat: 0.3, carbs: 3.3 },
  { id: 'dill', name: 'Кріп', department: 'veg', packGrams: 50, packLabel: '50 г', basePrice: 16, kcal: 43, protein: 3.5, fat: 1.1, carbs: 7 },

  // Fruit
  { id: 'apple', name: 'Яблука', department: 'fruit', packGrams: 1000, packLabel: '1 кг', basePrice: 36, kcal: 52, protein: 0.3, fat: 0.2, carbs: 14 },
  { id: 'banana', name: 'Банани', department: 'fruit', packGrams: 1000, packLabel: '1 кг', basePrice: 78, kcal: 89, protein: 1.1, fat: 0.3, carbs: 23 },

  // Dairy and eggs
  { id: 'milk', name: 'Молоко 2,5%', department: 'dairy', packGrams: 900, packLabel: '0,9 л', basePrice: 44, kcal: 52, protein: 2.8, fat: 2.5, carbs: 4.7, allergens: ['milk'], origin: ['dairy'] },
  { id: 'kefir', name: 'Кефір 2,5%', department: 'dairy', packGrams: 900, packLabel: '0,9 л', basePrice: 47, kcal: 50, protein: 2.9, fat: 2.5, carbs: 4, allergens: ['milk'], origin: ['dairy'] },
  { id: 'cottage', name: 'Сир кисломолочний 5%', department: 'dairy', packGrams: 350, packLabel: '350 г', basePrice: 72, kcal: 121, protein: 17, fat: 5, carbs: 1.8, allergens: ['milk'], origin: ['dairy'] },
  { id: 'sour_cream', name: 'Сметана 15%', department: 'dairy', packGrams: 350, packLabel: '350 г', basePrice: 46, kcal: 158, protein: 2.6, fat: 15, carbs: 3, allergens: ['milk'], origin: ['dairy'] },
  { id: 'cheese', name: 'Сир твердий', department: 'dairy', packGrams: 200, packLabel: '200 г', basePrice: 92, kcal: 350, protein: 25, fat: 27, carbs: 0, allergens: ['milk'], origin: ['dairy'] },
  { id: 'butter', name: 'Масло вершкове 73%', department: 'dairy', packGrams: 200, packLabel: '200 г', basePrice: 88, kcal: 662, protein: 0.8, fat: 73, carbs: 1.3, allergens: ['milk'], origin: ['dairy'] },
  { id: 'yogurt', name: 'Йогурт натуральний', department: 'dairy', packGrams: 300, packLabel: '300 г', basePrice: 42, kcal: 68, protein: 4.5, fat: 2.5, carbs: 6, allergens: ['milk'], origin: ['dairy'] },
  { id: 'eggs', name: 'Яйця', department: 'dairy', packGrams: 550, packLabel: '10 шт', basePrice: 62, kcal: 155, protein: 13, fat: 11, carbs: 1.1, allergens: ['eggs'], origin: ['egg'] },
  { id: 'tofu', name: 'Тофу', department: 'dairy', packGrams: 300, packLabel: '300 г', basePrice: 82, kcal: 144, protein: 15, fat: 8.7, carbs: 2.8, allergens: ['soy'] },

  // Meat
  { id: 'chicken_fillet', name: 'Куряче філе', department: 'meat', packGrams: 1000, packLabel: '1 кг', basePrice: 215, kcal: 113, protein: 23.6, fat: 1.9, carbs: 0.4, origin: ['meat'] },
  { id: 'chicken_thighs', name: 'Курячі стегна', department: 'meat', packGrams: 1000, packLabel: '1 кг', basePrice: 155, kcal: 185, protein: 18, fat: 12, carbs: 0, origin: ['meat'] },
  { id: 'mince', name: 'Фарш свино-яловичий', department: 'meat', packGrams: 1000, packLabel: '1 кг', basePrice: 235, kcal: 254, protein: 17, fat: 20, carbs: 0, origin: ['meat'] },
  { id: 'pork', name: 'Свинина (лопатка)', department: 'meat', packGrams: 1000, packLabel: '1 кг', basePrice: 245, kcal: 242, protein: 17, fat: 19, carbs: 0, origin: ['meat'] },
  { id: 'chicken_liver', name: 'Печінка куряча', department: 'meat', packGrams: 500, packLabel: '500 г', basePrice: 58, kcal: 136, protein: 19, fat: 6, carbs: 0.7, origin: ['meat'] },

  // Fish and frozen
  { id: 'hake', name: 'Хек заморожений', department: 'fish', packGrams: 1000, packLabel: '1 кг', basePrice: 225, kcal: 86, protein: 16.6, fat: 2.2, carbs: 0, allergens: ['fish'], origin: ['fish'] },
  { id: 'shrimp', name: 'Креветки заморожені', department: 'fish', packGrams: 500, packLabel: '500 г', basePrice: 210, kcal: 99, protein: 24, fat: 0.3, carbs: 0.2, allergens: ['shellfish'], origin: ['fish'] },
  { id: 'broccoli', name: 'Броколі заморожена', department: 'frozen', packGrams: 400, packLabel: '400 г', basePrice: 72, kcal: 34, protein: 2.8, fat: 0.4, carbs: 7 },
]

export const PRODUCT_BY_ID: Record<string, Product> = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]))

export const STORES: { id: StoreId; name: string; factor: number }[] = [
  { id: 'atb', name: 'АТБ', factor: 0.92 },
  { id: 'auchan', name: 'Ашан', factor: 0.98 },
  { id: 'varus', name: 'Varus', factor: 1.0 },
  { id: 'fora', name: 'Фора', factor: 1.03 },
  { id: 'novus', name: 'Novus', factor: 1.06 },
  { id: 'silpo', name: 'Сільпо', factor: 1.12 },
]

export const DEPARTMENT_NAMES: Record<Department, string> = {
  veg: 'Овочі',
  fruit: 'Фрукти',
  grocery: 'Бакалія',
  bakery: 'Хліб',
  dairy: 'Молочне та яйця',
  meat: "М'ясо",
  fish: 'Риба',
  frozen: 'Заморожене',
}

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return (h >>> 0) / 4294967295
}

/** Pack price at a store. Placeholder model: store factor plus a stable ±6% per-product spread. */
export function packPrice(productId: string, store: StoreId): number {
  const p = PRODUCT_BY_ID[productId]
  const s = STORES.find((x) => x.id === store)!
  const spread = 0.94 + hash(productId + store) * 0.12
  return Math.round(p.basePrice * s.factor * spread * 100) / 100
}
