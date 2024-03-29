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

export interface RowHeaderInfo {
    rowNum: number
    inside: boolean
}

export interface ColHeaderInfo {
    colNum: number
    inside: boolean
}
