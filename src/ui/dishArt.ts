import type { DishKind } from '../domain/types'

/** Placeholder art until real dish photos are added: an emoji on a soft tint. */
const EMOJI: Record<string, string> = {
  oat_banana: '🥣', oat_apple_honey: '🍎', omelette: '🍳', syrnyky: '🥞', buckwheat_milk: '🥣',
  cheese_toast: '🥪', millet_apple: '🍯', pb_toast: '🍌', yogurt_oats: '🥛', fried_eggs: '🍳',
  borshch: '🍲', lenten_borshch: '🍲', chicken_noodle: '🍜', lentil_soup: '🥘', mushroom_soup: '🍄',
  buckwheat_chicken: '🍗', pasta_mince: '🍝', plov: '🍛', cutlets_mash: '🥔', hake_rice: '🐟',
  liver_buckwheat: '🍖', stewed_cabbage: '🥬', chickpea_ragout: '🫛', bulgur_tofu: '🥗', deruny: '🥔',
  baked_chicken: '🍗', pasta_broccoli: '🥦', egg_fried_rice: '🍚', lazy_golubtsi: '🥬', bean_stew: '🫘',
  shrimp_rice: '🍤', millet_mushrooms: '🍄', apple_nuts: '🍏', kefir_banana: '🥛', cottage_honey: '🍯',
  banana: '🍌', carrot_hummus: '🥕',
}

const TINT: Record<DishKind, string> = {
  breakfast: 'var(--tint-sun)',
  soup: 'var(--tint-beet)',
  main: 'var(--tint-leaf)',
  snack: 'var(--tint-sky)',
}

export const dishEmoji = (id: string) => EMOJI[id] ?? '🍽️'
export const dishTint = (kind: DishKind) => TINT[kind]
