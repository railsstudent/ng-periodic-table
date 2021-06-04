// in milliseconds
export const STAY_AT_LEAST = 250
export const BASE_URL = 'https://en.wikipedia.org/wiki'

export const MAX_ROW_INDEX = 7
export const MAX_COL_INDEX = 18
export const DESCRIPTION = {
    number: 'Atomic',
    symbol: 'SYM',
    name: 'Name',
    atomic_mass: 'Weight',
}
export const LANT_ATOM_GROUP = {
    number: '57-71',
    category: 'lanthanide',
    symbol: '',
    name: '',
    atomic_mass: null,
}
export const ACT_ATOM_GROUP = {
    number: '89-103',
    category: 'actinide',
    symbol: '',
    name: '',
    atomic_mass: null,
}
// in milliseconds
export const HEADER_STAY_AT_LEAST = 25

export type Phase = 'solid' | 'liquid' | 'unknown' | 'gas' | ''

export enum Category {
    alkali = 'alkali',
    alkaline = 'alkaline',
    lant = 'lant',
    actinoid = 'actinoid',
    transition = 'transition',
    postTransition = 'postTransition',
    metalloid = 'metalloid',
    nonMetal = 'nonMetal',
    nobleGas = 'nobleGas',
    allMetals = 'allMetals',
    allNonMetals = 'allNonMetals',
}

export const CATEGORY_MAP: Record<string, Category> = {
    'alkali-metal': Category.alkali,
    'alkaline-earth-metal': Category.alkaline,
    lanthanide: Category.lant,
    actinide: Category.actinoid,
    'transition-metal': Category.transition,
    'post-transition-metal': Category.postTransition,
    metalloid: Category.metalloid,
    nonmetal: Category.nonMetal,
    'noble-gas': Category.nobleGas,
}

export const CATEGORY_GROUPS: Record<Category, Category[]> = {
    [Category.alkali]: [Category.alkali],
    [Category.alkaline]: [Category.alkaline],
    [Category.lant]: [Category.lant],
    [Category.actinoid]: [Category.actinoid],
    [Category.transition]: [Category.transition],
    [Category.postTransition]: [Category.postTransition],
    [Category.metalloid]: [Category.metalloid],
    [Category.nonMetal]: [Category.nonMetal],
    [Category.nobleGas]: [Category.nobleGas],
    [Category.allMetals]: [
        Category.alkali,
        Category.alkaline,
        Category.lant,
        Category.actinoid,
        Category.transition,
        Category.postTransition,
    ],
    [Category.allNonMetals]: [Category.nonMetal, Category.nobleGas],
}
