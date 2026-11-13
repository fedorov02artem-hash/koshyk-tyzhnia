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
  // ---- More breakfasts ----
  { id: 'semolina_berries', name: 'Манна каша з ягодами', kind: 'breakfast', minutes: 10, ingredients: [i('semolina', 60), i('milk', 220), i('berries', 60), i('sugar', 8), i('butter', 5)] },
  { id: 'corn_pumpkin', name: 'Кукурудзяна каша з гарбузом', kind: 'breakfast', minutes: 25, ingredients: [i('corn_grits', 60), i('pumpkin', 120), i('milk', 150), i('butter', 5), i('honey', 10)] },
  { id: 'rice_milk', name: 'Рисова каша на молоці з родзинками', kind: 'breakfast', minutes: 25, ingredients: [i('rice', 60), i('milk', 220), i('raisins', 20), i('butter', 5)] },
  { id: 'millet_pumpkin', name: 'Пшоняна каша з гарбузом', kind: 'breakfast', minutes: 30, ingredients: [i('millet', 60), i('pumpkin', 150), i('milk', 150), i('honey', 10)] },
  { id: 'crepes_cottage', name: 'Млинці з сиром', kind: 'breakfast', minutes: 35, ingredients: [i('flour', 60), i('milk', 150), i('eggs', 30), i('cottage', 100), i('sugar', 10), i('oil', 8)] },
  { id: 'oladky_apple', name: 'Оладки на кефірі з яблуком', kind: 'breakfast', minutes: 25, ingredients: [i('flour', 70), i('kefir', 150), i('eggs', 25), i('apple', 80), i('sugar', 10), i('oil', 12)] },
  { id: 'zapekanka', name: 'Сирна запіканка з родзинками', kind: 'breakfast', minutes: 45, batch: true, ingredients: [i('cottage', 180), i('semolina', 25), i('eggs', 30), i('raisins', 20), i('sugar', 10), i('sour_cream', 30)] },
  { id: 'lazy_vareniki', name: 'Ліниві вареники зі сметаною', kind: 'breakfast', minutes: 25, ingredients: [i('cottage', 170), i('flour', 40), i('eggs', 25), i('sour_cream', 40), i('sugar', 5)] },
  { id: 'scramble_veg', name: 'Скрембл з перцем і помідорами', kind: 'breakfast', minutes: 10, ingredients: [i('eggs', 120), i('pepper', 80), i('tomato', 80), i('dill', 3), i('oil', 5), i('rye_bread', 50)] },
  { id: 'omelette_spinach', name: 'Омлет зі шпинатом і бринзою', kind: 'breakfast', minutes: 15, ingredients: [i('eggs', 110), i('spinach', 80), i('brynza', 30), i('milk', 40), i('oil', 5), i('bread', 40)] },
  { id: 'eggs_sausages', name: 'Яєчня з сосисками', kind: 'breakfast', minutes: 10, ingredients: [i('eggs', 110), i('sausages', 80), i('tomato', 80), i('oil', 5), i('bread', 50)] },
  { id: 'tuna_sandwich', name: 'Сендвіч з тунцем і огірком', kind: 'breakfast', minutes: 10, ingredients: [i('loaf', 80), i('tuna_can', 60), i('cucumber', 80), i('eggs', 30)] },
  { id: 'lavash_cheese', name: 'Лаваш з сиром і помідорами', kind: 'breakfast', minutes: 10, ingredients: [i('lavash', 80), i('cheese', 40), i('tomato', 100), i('dill', 3)] },
  { id: 'brynza_toast', name: 'Житні тости з бринзою і помідорами', kind: 'breakfast', minutes: 5, ingredients: [i('rye_bread', 80), i('brynza', 50), i('tomato', 120), i('oil', 5)] },
  { id: 'overnight_oats', name: 'Лінива вівсянка на кефірі з ягодами', kind: 'breakfast', minutes: 5, ingredients: [i('oats', 60), i('kefir', 200), i('berries', 80), i('honey', 10)] },
  { id: 'buckwheat_egg', name: 'Гречка з яйцем і огірком', kind: 'breakfast', minutes: 20, ingredients: [i('buckwheat', 60), i('eggs', 55), i('cucumber', 100), i('butter', 5)] },
  { id: 'cottage_berries', name: 'Сир з ягодами і сметаною', kind: 'breakfast', minutes: 5, ingredients: [i('cottage', 180), i('berries', 80), i('sour_cream', 30), i('honey', 10)] },
  { id: 'banana_pancakes', name: 'Бананові панкейки', kind: 'breakfast', minutes: 15, ingredients: [i('banana', 120), i('eggs', 55), i('oats', 40), i('oil', 5), i('honey', 10)] },
  { id: 'french_toast', name: 'Грінки з ягодами', kind: 'breakfast', minutes: 15, ingredients: [i('loaf', 90), i('eggs', 55), i('milk', 60), i('butter', 8), i('berries', 50)] },
  { id: 'oat_pear', name: 'Вівсянка з грушею і горіхами', kind: 'breakfast', minutes: 10, ingredients: [i('oats', 60), i('milk', 180), i('pear', 120), i('walnuts', 10)] },

  // ---- More soups (cooked for two days) ----
  { id: 'kapusniak', name: 'Капусняк зі свининою', kind: 'soup', minutes: 70, batch: true, ingredients: [i('sauerkraut', 120), i('pork', 70), i('potato', 100), i('carrot', 30), i('onion', 30), i('millet', 20), i('oil', 5), i('bread', 50)] },
  { id: 'pea_soup', name: 'Гороховий суп з сосисками', kind: 'soup', minutes: 60, batch: true, ingredients: [i('split_peas', 60), i('sausages', 50), i('potato', 80), i('carrot', 30), i('onion', 30), i('oil', 5), i('bread', 50)] },
  { id: 'pea_soup_lenten', name: 'Пісний гороховий суп', kind: 'soup', minutes: 60, batch: true, ingredients: [i('split_peas', 70), i('potato', 80), i('carrot', 30), i('onion', 30), i('oil', 10), i('bread', 50)] },
  { id: 'rassolnyk', name: 'Розсольник з перловкою і куркою', kind: 'soup', minutes: 60, batch: true, ingredients: [i('barley', 30), i('pickles', 60), i('chicken_thighs', 80), i('potato', 90), i('carrot', 30), i('onion', 30), i('oil', 5), i('bread', 50)] },
  { id: 'meatball_soup', name: 'Суп з курячими фрикадельками', kind: 'soup', minutes: 45, batch: true, ingredients: [i('chicken_mince', 90), i('eggs', 10), i('rice', 20), i('potato', 100), i('carrot', 30), i('onion', 30), i('dill', 3), i('bread', 50)] },
  { id: 'fish_soup', name: 'Юшка з минтаю', kind: 'soup', minutes: 40, batch: true, ingredients: [i('pollock', 120), i('potato', 120), i('carrot', 30), i('onion', 30), i('millet', 15), i('dill', 3), i('bread', 50)] },
  { id: 'pumpkin_cream', name: 'Гарбузовий крем-суп з насінням', kind: 'soup', minutes: 40, batch: true, ingredients: [i('pumpkin', 250), i('potato', 60), i('onion', 30), i('cream', 40), i('oil', 8), i('sunflower_seeds', 10), i('bread', 40)] },
  { id: 'cauliflower_cream', name: 'Крем-суп з цвітної капусти', kind: 'soup', minutes: 35, batch: true, ingredients: [i('cauliflower', 200), i('potato', 80), i('onion', 30), i('cream', 40), i('cheese', 15), i('oil', 5), i('bread', 40)] },
  { id: 'veg_bean_soup', name: 'Овочевий суп з квасолею і томатами', kind: 'soup', minutes: 35, batch: true, ingredients: [i('beans_can', 100), i('potato', 100), i('carrot', 40), i('onion', 30), i('pepper', 50), i('tomatoes_can', 100), i('oil', 8), i('bread', 50)] },
  { id: 'buckwheat_soup', name: 'Гречаний суп з куркою', kind: 'soup', minutes: 45, batch: true, ingredients: [i('buckwheat', 35), i('chicken_thighs', 90), i('potato', 90), i('carrot', 30), i('onion', 30), i('dill', 3), i('bread', 50)] },
  { id: 'bean_beef_soup', name: 'Квасоляний суп з яловичиною', kind: 'soup', minutes: 90, batch: true, ingredients: [i('beans_dry', 50), i('beef', 70), i('potato', 80), i('carrot', 30), i('onion', 30), i('tomato_paste', 10), i('oil', 5), i('bread', 50)] },
  { id: 'halushky_soup', name: 'Курячий суп з галушками', kind: 'soup', minutes: 50, batch: true, ingredients: [i('flour', 40), i('eggs', 15), i('chicken_thighs', 80), i('potato', 90), i('carrot', 30), i('onion', 30), i('dill', 3)] },
  { id: 'shchi', name: 'Щі зі свіжої капусти з куркою', kind: 'soup', minutes: 50, batch: true, ingredients: [i('cabbage', 120), i('chicken_thighs', 80), i('potato', 90), i('carrot', 30), i('onion', 30), i('tomato_paste', 10), i('dill', 3), i('bread', 50)] },
  { id: 'turkey_noodle', name: 'Суп з індичкою і вермішеллю', kind: 'soup', minutes: 40, batch: true, ingredients: [i('turkey', 90), i('spaghetti', 30), i('potato', 80), i('carrot', 30), i('onion', 20), i('dill', 3), i('bread', 50)] },
  { id: 'mushroom_barley', name: 'Грибний суп з перловкою', kind: 'soup', minutes: 60, batch: true, ingredients: [i('mushrooms', 90), i('barley', 30), i('potato', 90), i('carrot', 30), i('onion', 30), i('oil', 8), i('sour_cream', 20), i('bread', 50)] },

  // ---- More mains ----
  { id: 'turkey_bulgur', name: 'Індичка з булгуром і овочами', kind: 'main', minutes: 30, ingredients: [i('turkey', 130), i('bulgur', 75), i('pepper', 60), i('zucchini', 80), i('oil', 10)] },
  { id: 'goulash_buckwheat', name: 'Гуляш з яловичини з гречкою', kind: 'main', minutes: 80, batch: true, ingredients: [i('beef', 120), i('buckwheat', 75), i('onion', 40), i('carrot', 30), i('tomato_paste', 15), i('flour', 5), i('oil', 10)] },
  { id: 'beef_potato', name: 'Тушкована картопля з яловичиною', kind: 'main', minutes: 80, batch: true, ingredients: [i('beef', 100), i('potato', 250), i('onion', 30), i('carrot', 30), i('oil', 10)] },
  { id: 'drumsticks_rice', name: 'Курячі гомілки з рисом і овочами', kind: 'main', minutes: 50, ingredients: [i('drumsticks', 180), i('rice', 75), i('veg_mix', 120), i('oil', 8)] },
  { id: 'chicken_cutlets', name: 'Курячі котлети з гречкою', kind: 'main', minutes: 35, ingredients: [i('chicken_mince', 140), i('eggs', 15), i('bread', 20), i('onion', 20), i('buckwheat', 75), i('oil', 10)] },
  { id: 'chicken_cream_pasta', name: 'Курка в сметані з макаронами', kind: 'main', minutes: 30, ingredients: [i('chicken_fillet', 130), i('sour_cream', 40), i('onion', 30), i('garlic', 5), i('pasta', 85), i('oil', 8)] },
  { id: 'bolognese', name: 'Спагеті болоньєзе', kind: 'main', minutes: 35, ingredients: [i('spaghetti', 90), i('mince', 100), i('tomatoes_can', 150), i('onion', 30), i('garlic', 5), i('cheese', 15), i('oil', 5)] },
  { id: 'tuna_spaghetti', name: 'Спагеті з тунцем і томатами', kind: 'main', minutes: 20, ingredients: [i('spaghetti', 90), i('tuna_can', 80), i('tomatoes_can', 150), i('garlic', 5), i('oil', 8)] },
  { id: 'pelmeni', name: 'Пельмені зі сметаною', kind: 'main', minutes: 15, ingredients: [i('pelmeni', 250), i('sour_cream', 40), i('butter', 5)] },
  { id: 'vareniki_potato', name: 'Вареники з картоплею і смаженою цибулею', kind: 'main', minutes: 15, ingredients: [i('vareniki', 280), i('onion', 40), i('oil', 12), i('sour_cream', 30)] },
  { id: 'stuffed_peppers', name: 'Фаршировані перці', kind: 'main', minutes: 70, batch: true, ingredients: [i('pepper', 200), i('mince', 90), i('rice', 35), i('carrot', 30), i('onion', 30), i('tomato_paste', 15), i('sour_cream', 25)] },
  { id: 'eggplant_mince', name: 'Баклажани запечені з фаршем і сиром', kind: 'main', minutes: 50, ingredients: [i('eggplant', 200), i('mince', 90), i('tomato', 100), i('cheese', 30), i('garlic', 5), i('oil', 12)] },
  { id: 'eggplant_ragout', name: 'Рагу з баклажанів і картоплі', kind: 'main', minutes: 50, batch: true, ingredients: [i('eggplant', 180), i('potato', 150), i('pepper', 60), i('tomato', 80), i('onion', 30), i('garlic', 5), i('oil', 15)] },
  { id: 'mackerel_potato', name: 'Запечена скумбрія з картоплею', kind: 'main', minutes: 45, ingredients: [i('mackerel', 170), i('potato', 250), i('onion', 20), i('oil', 8), i('dill', 3)] },
  { id: 'fish_cutlets', name: 'Рибні котлети з пюре', kind: 'main', minutes: 45, ingredients: [i('pollock', 150), i('eggs', 15), i('bread', 20), i('onion', 20), i('potato', 230), i('milk', 40), i('butter', 10), i('oil', 10)] },
  { id: 'pollock_rice', name: 'Минтай під морквою з рисом', kind: 'main', minutes: 40, ingredients: [i('pollock', 160), i('carrot', 60), i('onion', 40), i('tomato_paste', 10), i('rice', 75), i('oil', 10)] },
  { id: 'squid_rice', name: 'Кальмари з рисом і овочами', kind: 'main', minutes: 25, ingredients: [i('squid', 130), i('rice', 75), i('veg_mix', 120), i('soy_sauce', 10), i('oil', 8)] },
  { id: 'sausages_mash', name: 'Сосиски з пюре і квашеною капустою', kind: 'main', minutes: 30, ingredients: [i('sausages', 120), i('potato', 250), i('milk', 40), i('butter', 10), i('sauerkraut', 100)] },
  { id: 'pork_veg_bake', name: 'Свинина, запечена з овочами', kind: 'main', minutes: 60, ingredients: [i('pork', 140), i('potato', 200), i('carrot', 50), i('pepper', 60), i('garlic', 5), i('oil', 8)] },
  { id: 'chicken_salad', name: 'Теплий салат з куркою і овочами', kind: 'main', minutes: 20, ingredients: [i('chicken_fillet', 120), i('cucumber', 100), i('tomato', 100), i('pepper', 50), i('eggs', 30), i('oil', 10), i('bread', 50)] },
  { id: 'tofu_stirfry', name: 'Тофу з овочами і рисом', kind: 'main', minutes: 25, ingredients: [i('tofu', 120), i('veg_mix', 150), i('rice', 70), i('soy_sauce', 15), i('garlic', 5), i('oil', 10)] },
  { id: 'lentil_cutlets', name: 'Сочевичні котлети з салатом', kind: 'main', minutes: 40, ingredients: [i('lentils', 80), i('onion', 30), i('carrot', 40), i('flour', 15), i('oil', 12), i('cucumber', 100), i('tomato', 80)] },
  { id: 'chickpea_spinach', name: 'Нут зі шпинатом і томатами з рисом', kind: 'main', minutes: 30, ingredients: [i('chickpeas', 70), i('tomatoes_can', 150), i('spinach', 80), i('onion', 30), i('garlic', 5), i('rice', 60), i('oil', 10)] },
  { id: 'mushroom_plov', name: 'Плов з грибами і нутом', kind: 'main', minutes: 50, batch: true, ingredients: [i('rice', 80), i('mushrooms', 120), i('chickpeas', 30), i('carrot', 60), i('onion', 30), i('garlic', 5), i('oil', 12)] },
  { id: 'barley_mushrooms', name: 'Перловка з грибами', kind: 'main', minutes: 50, ingredients: [i('barley', 80), i('mushrooms', 150), i('onion', 40), i('carrot', 30), i('oil', 12)] },
  { id: 'mamalyga', name: 'Мамалига з бринзою і сметаною', kind: 'main', minutes: 30, ingredients: [i('corn_grits', 80), i('brynza', 50), i('sour_cream', 30), i('butter', 10)] },
  { id: 'cauliflower_bake', name: 'Цвітна капуста, запечена з сиром', kind: 'main', minutes: 40, ingredients: [i('cauliflower', 250), i('eggs', 55), i('cheese', 35), i('milk', 50), i('potato', 120), i('oil', 5)] },
  { id: 'zucchini_fritters', name: 'Кабачкові оладки зі сметаною', kind: 'main', minutes: 30, ingredients: [i('zucchini', 250), i('eggs', 40), i('flour', 40), i('garlic', 3), i('oil', 15), i('sour_cream', 40)] },
  { id: 'potato_mushrooms', name: 'Смажена картопля з грибами', kind: 'main', minutes: 35, ingredients: [i('potato', 280), i('mushrooms', 120), i('onion', 40), i('oil', 18), i('dill', 3), i('pickles', 60)] },
  { id: 'beef_rice', name: 'Яловичина з рисом і перцем', kind: 'main', minutes: 40, ingredients: [i('beef', 110), i('rice', 75), i('pepper', 80), i('onion', 30), i('soy_sauce', 10), i('oil', 8)] },
  { id: 'turkey_meatballs', name: 'Тефтелі з індички в томаті з макаронами', kind: 'main', minutes: 45, batch: true, ingredients: [i('turkey', 120), i('rice', 15), i('eggs', 10), i('tomatoes_can', 120), i('onion', 30), i('pasta', 80), i('oil', 5)] },
  { id: 'chicken_green_beans', name: 'Курка зі стручковою квасолею і картоплею', kind: 'main', minutes: 35, ingredients: [i('chicken_fillet', 120), i('green_beans', 150), i('potato', 180), i('garlic', 5), i('oil', 10)] },
  { id: 'home_shawarma', name: 'Домашня шаурма з куркою', kind: 'main', minutes: 25, ingredients: [i('lavash', 90), i('chicken_fillet', 110), i('cabbage', 80), i('cucumber', 60), i('tomato', 60), i('sour_cream', 30), i('garlic', 3)] },
  { id: 'pea_puree_chicken', name: 'Горохове пюре з курячими гомілками', kind: 'main', minutes: 60, ingredients: [i('split_peas', 80), i('drumsticks', 160), i('onion', 30), i('carrot', 30), i('oil', 8)] },
  { id: 'buckwheat_mushrooms', name: 'Гречка з грибами і цибулею', kind: 'main', minutes: 30, ingredients: [i('buckwheat', 80), i('mushrooms', 150), i('onion', 40), i('carrot', 30), i('oil', 12)] },
  { id: 'pumpkin_rice', name: 'Рис з гарбузом і сиром', kind: 'main', minutes: 35, ingredients: [i('rice', 80), i('pumpkin', 180), i('onion', 30), i('cheese', 25), i('butter', 8)] },
  { id: 'olivier_bowl', name: 'Картопля з горошком, кукурудзою і яйцем', kind: 'main', minutes: 30, ingredients: [i('potato', 220), i('peas_can', 80), i('corn_can', 60), i('eggs', 55), i('pickles', 50), i('sour_cream', 30)] },

  // ---- More snacks ----
  { id: 'orange', name: 'Апельсин', kind: 'snack', minutes: 0, ingredients: [i('orange', 200)] },
  { id: 'pear', name: 'Груша', kind: 'snack', minutes: 0, ingredients: [i('pear', 180)] },
  { id: 'mandarins', name: 'Мандарини', kind: 'snack', minutes: 0, ingredients: [i('mandarin', 200)] },
  { id: 'yogurt_berries', name: 'Йогурт з ягодами', kind: 'snack', minutes: 2, ingredients: [i('yogurt', 180), i('berries', 80)] },
  { id: 'raisins_seeds', name: 'Родзинки з насінням', kind: 'snack', minutes: 0, ingredients: [i('raisins', 25), i('sunflower_seeds', 20)] },
  { id: 'rye_cheese', name: 'Житній хліб з сиром', kind: 'snack', minutes: 2, ingredients: [i('rye_bread', 50), i('cheese', 30)] },
  { id: 'egg_cucumber', name: 'Варене яйце з огірком', kind: 'snack', minutes: 10, ingredients: [i('eggs', 55), i('cucumber', 120)] },
  { id: 'carrot_apple_salad', name: 'Салат з моркви і яблука', kind: 'snack', minutes: 10, ingredients: [i('carrot', 120), i('apple', 100), i('sour_cream', 25), i('raisins', 10)] },
  { id: 'kefir_berries', name: 'Кефір з ягодами', kind: 'snack', minutes: 2, ingredients: [i('kefir', 250), i('berries', 60)] },
  { id: 'apple_pb', name: 'Яблуко з арахісовою пастою', kind: 'snack', minutes: 2, ingredients: [i('apple', 150), i('peanut_butter', 20)] },
  { id: 'baked_apple', name: 'Печене яблуко з медом і горіхами', kind: 'snack', minutes: 25, ingredients: [i('apple', 200), i('honey', 10), i('walnuts', 10)] },
  { id: 'cottage_raisins', name: 'Сир з родзинками і сметаною', kind: 'snack', minutes: 2, ingredients: [i('cottage', 150), i('raisins', 20), i('sour_cream', 20)] },
  { id: 'banana_shake', name: 'Молочний коктейль з бананом', kind: 'snack', minutes: 3, ingredients: [i('milk', 250), i('banana', 120)] },
]

const NO_COOKING = ['cheese_toast', 'pb_toast', 'yogurt_oats', 'apple_nuts', 'kefir_banana', 'cottage_honey', 'banana', 'brynza_toast', 'overnight_oats',
  'cottage_berries', 'lavash_cheese', 'orange', 'pear', 'mandarins', 'yogurt_berries', 'raisins_seeds', 'rye_cheese', 'carrot_apple_salad', 'kefir_berries',
  'apple_pb', 'cottage_raisins']
const OVEN = ['baked_chicken', 'hake_rice', 'zapekanka', 'eggplant_mince', 'mackerel_potato', 'pork_veg_bake', 'cauliflower_bake', 'baked_apple']
const BLENDER = ['pumpkin_cream', 'cauliflower_cream', 'banana_shake', 'carrot_hummus']
/** Dishes that also work in a microwave. */
const MICRO = ['oat_banana', 'oat_apple_honey', 'oat_pear', 'semolina_berries', 'omelette', 'omelette_spinach', 'scramble_veg', 'fried_eggs', 'eggs_sausages',
  'baked_apple', 'buckwheat_milk', 'tuna_sandwich', 'egg_cucumber', 'buckwheat_egg', 'pelmeni', 'vareniki_potato', 'zapekanka']
for (const d of DISHES) {
  d.tool = NO_COOKING.includes(d.id) ? 'none' : OVEN.includes(d.id) ? 'oven' : BLENDER.includes(d.id) ? 'blender' : 'stove'
  if (MICRO.includes(d.id)) d.micro = true
}

export const DISH_BY_ID: Record<string, Dish> = Object.fromEntries(DISHES.map((d) => [d.id, d]))
