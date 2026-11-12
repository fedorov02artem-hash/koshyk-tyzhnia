import type { Dish } from './types'

const i = (productId: string, grams: number) => ({ productId, grams })

/** Ingredient grams are for one standard portion (~one adult). */
export const DISHES: Dish[] = [
  // Breakfasts
  { id: 'oat_banana', name: 'Вівсянка на молоці з бананом', kind: 'breakfast', minutes: 10, ingredients: [i('oats', 60), i('milk', 180), i('banana', 100)] },
  { id: 'oat_apple_honey', name: 'Вівсянка з яблуком, медом і горіхами', kind: 'breakfast', minutes: 10, ingredients: [i('oats', 60), i('apple', 120), i('honey', 10), i('walnuts', 15)] },
  { id: 'omelette', name: 'Омлет з помідорами і хлібом', kind: 'breakfast', minutes: 15, ingredients: [i('eggs', 110), i('milk', 40), i('tomato', 100), i('bread', 50), i('butter', 5)] },
  { id: 'syrnyky', name: 'Сирники зі сметаною', kind: 'breakfast', minutes: 25, ingredients: [i('cottage', 170), i('eggs', 30), i('flour', 30), i('sour_cream', 40), i('oil', 10)] },
  { id: 'buckwheat_milk', name: 'Гречана каша з молоком', kind: 'breakfast', minutes: 20, ingredients: [i('buckwheat', 70), i('milk', 220), i('butter', 5)] },
  { id: 'cheese_toast', name: 'Бутерброди з сиром і огірком', kind: 'breakfast', minutes: 5, ingredients: [i('bread', 90), i('cheese', 35), i('butter', 10), i('cucumber', 80)] },
  { id: 'millet_apple', name: 'Пшоняна каша з яблуком', kind: 'breakfast', minutes: 25, ingredients: [i('millet', 70), i('apple', 120), i('oil', 5)] },
  { id: 'pb_toast', name: 'Тости з арахісовою пастою і бананом', kind: 'breakfast', minutes: 5, ingredients: [i('bread', 80), i('peanut_butter', 25), i('banana', 100)] },
  { id: 'yogurt_oats', name: 'Йогурт з вівсянкою і яблуком', kind: 'breakfast', minutes: 5, ingredients: [i('yogurt', 180), i('oats', 40), i('apple', 100)] },
  { id: 'fried_eggs', name: 'Яєчня з хлібом і огірком', kind: 'breakfast', minutes: 10, ingredients: [i('eggs', 110), i('bread', 60), i('oil', 5), i('cucumber', 100)] },

  // Soups (lunch), cooked for two days
  { id: 'borshch', name: 'Борщ зі свининою', kind: 'soup', minutes: 90, batch: true, ingredients: [i('beet', 70), i('cabbage', 70), i('potato', 90), i('carrot', 30), i('onion', 30), i('tomato_paste', 10), i('pork', 70), i('oil', 5), i('sour_cream', 20), i('bread', 50)] },
  { id: 'lenten_borshch', name: 'Пісний борщ з квасолею', kind: 'soup', minutes: 70, batch: true, ingredients: [i('beet', 70), i('cabbage', 70), i('potato', 90), i('carrot', 30), i('onion', 30), i('tomato_paste', 10), i('beans_can', 100), i('oil', 10), i('bread', 50)] },
  { id: 'chicken_noodle', name: 'Курячий суп з локшиною', kind: 'soup', minutes: 50, batch: true, ingredients: [i('chicken_thighs', 90), i('pasta', 30), i('potato', 70), i('carrot', 30), i('onion', 20), i('dill', 3), i('bread', 50)] },
  { id: 'lentil_soup', name: 'Суп із сочевиці', kind: 'soup', minutes: 40, batch: true, ingredients: [i('lentils', 60), i('potato', 70), i('carrot', 30), i('onion', 30), i('tomato_paste', 10), i('oil', 10), i('bread', 50)] },
  { id: 'mushroom_soup', name: 'Грибний суп', kind: 'soup', minutes: 45, batch: true, ingredients: [i('mushrooms', 90), i('potato', 110), i('carrot', 30), i('onion', 30), i('millet', 20), i('oil', 10), i('dill', 3), i('bread', 50)] },

  // Mains (lunch or dinner)
  { id: 'buckwheat_chicken', name: 'Гречка з курячим філе', kind: 'main', minutes: 35, ingredients: [i('buckwheat', 80), i('chicken_fillet', 130), i('onion', 30), i('carrot', 30), i('oil', 10)] },
  { id: 'pasta_mince', name: 'Макарони з фаршем у томаті', kind: 'main', minutes: 30, ingredients: [i('pasta', 90), i('mince', 100), i('tomato_paste', 15), i('onion', 30), i('oil', 5)] },
  { id: 'plov', name: 'Плов з куркою', kind: 'main', minutes: 60, batch: true, ingredients: [i('rice', 80), i('chicken_thighs', 130), i('carrot', 60), i('onion', 30), i('garlic', 5), i('oil', 12)] },
  { id: 'cutlets_mash', name: 'Котлети з картопляним пюре', kind: 'main', minutes: 50, ingredients: [i('potato', 250), i('milk', 40), i('butter', 10), i('mince', 120), i('eggs', 15), i('bread', 20), i('onion', 20), i('oil', 10)] },
  { id: 'hake_rice', name: 'Запечений хек з рисом', kind: 'main', minutes: 40, ingredients: [i('hake', 160), i('rice', 75), i('carrot', 40), i('onion', 20), i('oil', 10)] },
  { id: 'liver_buckwheat', name: 'Печінка в сметані з гречкою', kind: 'main', minutes: 30, ingredients: [i('chicken_liver', 130), i('buckwheat', 75), i('onion', 40), i('sour_cream', 30), i('oil', 10)] },
  { id: 'stewed_cabbage', name: 'Тушкована капуста зі свининою', kind: 'main', minutes: 60, batch: true, ingredients: [i('cabbage', 280), i('pork', 100), i('carrot', 30), i('onion', 30), i('tomato_paste', 10), i('oil', 10), i('bread', 50)] },
  { id: 'chickpea_ragout', name: 'Овочеве рагу з нутом', kind: 'main', minutes: 50, batch: true, ingredients: [i('chickpeas', 70), i('zucchini', 150), i('potato', 120), i('pepper', 60), i('tomato', 80), i('onion', 30), i('oil', 12)] },
  { id: 'bulgur_tofu', name: 'Булгур з овочами і тофу', kind: 'main', minutes: 30, ingredients: [i('bulgur', 75), i('tofu', 110), i('pepper', 70), i('carrot', 40), i('soy_sauce', 15), i('sesame', 5), i('oil', 10)] },
  { id: 'deruny', name: 'Деруни зі сметаною', kind: 'main', minutes: 40, ingredients: [i('potato', 300), i('eggs', 30), i('flour', 30), i('onion', 30), i('oil', 20), i('sour_cream', 40)] },
  { id: 'baked_chicken', name: 'Запечені стегна з картоплею', kind: 'main', minutes: 60, ingredients: [i('chicken_thighs', 160), i('potato', 260), i('garlic', 5), i('oil', 10), i('cucumber', 80)] },
  { id: 'pasta_broccoli', name: 'Паста з броколі і сиром', kind: 'main', minutes: 20, ingredients: [i('pasta', 90), i('broccoli', 130), i('cheese', 30), i('garlic', 5), i('oil', 10)] },
  { id: 'egg_fried_rice', name: 'Рис з овочами і яйцем', kind: 'main', minutes: 25, ingredients: [i('rice', 85), i('eggs', 55), i('carrot', 40), i('broccoli', 90), i('soy_sauce', 15), i('oil', 10)] },
  { id: 'lazy_golubtsi', name: 'Ліниві голубці', kind: 'main', minutes: 60, batch: true, ingredients: [i('cabbage', 160), i('mince', 100), i('rice', 40), i('carrot', 30), i('onion', 30), i('tomato_paste', 15), i('sour_cream', 25)] },
  { id: 'bean_stew', name: 'Тушкована квасоля з овочами', kind: 'main', minutes: 25, ingredients: [i('beans_can', 220), i('onion', 40), i('carrot', 40), i('pepper', 50), i('tomato_paste', 15), i('oil', 10), i('bread', 60)] },
  { id: 'shrimp_rice', name: 'Рис з креветками і овочами', kind: 'main', minutes: 25, ingredients: [i('rice', 80), i('shrimp', 120), i('pepper', 60), i('zucchini', 100), i('garlic', 5), i('oil', 10)] },
  { id: 'millet_mushrooms', name: 'Пшоно з грибами і цибулею', kind: 'main', minutes: 30, ingredients: [i('millet', 80), i('mushrooms', 150), i('onion', 40), i('oil', 12), i('dill', 3)] },

  // Snacks
  { id: 'apple_nuts', name: 'Яблуко з горіхами', kind: 'snack', minutes: 1, ingredients: [i('apple', 150), i('walnuts', 20)] },
  { id: 'kefir_banana', name: 'Кефір з бананом', kind: 'snack', minutes: 1, ingredients: [i('kefir', 250), i('banana', 100)] },
  { id: 'cottage_honey', name: 'Кисломолочний сир з медом', kind: 'snack', minutes: 2, ingredients: [i('cottage', 150), i('honey', 15)] },
  { id: 'banana', name: 'Банан', kind: 'snack', minutes: 0, ingredients: [i('banana', 130)] },
  { id: 'carrot_hummus', name: 'Морква з хумусом з нуту', kind: 'snack', minutes: 15, ingredients: [i('carrot', 120), i('chickpeas', 30), i('garlic', 3), i('oil', 8)] },
]

export const DISH_BY_ID: Record<string, Dish> = Object.fromEntries(DISHES.map((d) => [d.id, d]))
