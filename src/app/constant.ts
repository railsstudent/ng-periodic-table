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

export interface HighlightState {
    alkali: boolean
    alkaline: boolean
    lant: boolean
    actinoid: boolean
    transition: boolean
    postTransition: boolean
    metalloid: boolean
    nonMetal: boolean
    nobleGas: boolean
}

export type Phase = 'solid' | 'liquid' | 'unknown' | 'gas'

export interface Atom {
    number: number
    category: string
    symbol: string
    name: string
    atomic_mass: number
    phase: Phase
    xpos: number
    ypos: number
    blurry: boolean
}

export interface StyleAtom extends Atom {
    solidStyle: boolean
    gasStyle: boolean
    liquidStyle: boolean
    unknownStyle: boolean
}

export const CATEGORY_MAP: Record<string, string> = {
    'alkali-metal': 'alkali',
    'alkaline-earth-metal': 'alkaline',
    lanthanide: 'lant',
    actinide: 'actinoid',
    'transition-metal': 'transition',
    'post-transition-metal': 'postTransition',
    metalloid: 'metalloid',
    nonmetal: 'nonMetal',
    'noble-gas': 'nobleGas',
}

export const CATEGORIES = [
    'alkali',
    'alkaline',
    'lant',
    'actinoid',
    'transition',
    'postTransition',
    'metalloid',
    'nonMetal',
    'nobleGas',
]

export const INIT_HIGHLIGHT_STATE: HighlightState = {
    alkali: false,
    alkaline: false,
    lant: false,
    actinoid: false,
    transition: false,
    postTransition: false,
    metalloid: false,
    nonMetal: false,
    nobleGas: false,
}

export interface HeaderInfo {
    rowNum: number
    colNum: number
    inside: boolean
}
