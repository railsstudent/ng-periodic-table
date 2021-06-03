import { Phase } from './constant'

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
    solidSelectedStyle: boolean
    gasSelectedStyle: boolean
    liquidSelectedStyle: boolean
    unknownSelectedStyle: boolean
    grayout: boolean
}

export interface HeaderInfo {
    rowNum: number
    colNum: number
    inside: boolean
}

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
    allMetals: boolean
    allNonMetals: boolean
}

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
    allMetals: false,
    allNonMetals: false,
}
