import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core'
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs'
import { debounceTime, map, takeUntil } from 'rxjs/operators'
import {
    ACT_ATOM_GROUP,
    CATEGORY_GROUPS,
    CATEGORY_MAP,
    DESCRIPTION,
    HEADER_STAY_AT_LEAST,
    LANT_ATOM_GROUP,
    MAX_ROW_INDEX,
    Phase,
} from '../constant'
import { PeriodTableService } from './periodic-table.service'
import { StyleAtom, RowHeaderInfo, ColHeaderInfo } from '../types'

const langAtonRow = 6
const actAtomRow = 7
const lantAtomPos = 8
const actAtomPos = 9

@Component({
    selector: 'app-periodic-table',
    templateUrl: './periodic-table.component.html',
    styleUrls: ['./periodic-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeriodicTableComponent implements OnInit, OnDestroy {
    description = DESCRIPTION
    lantAtomGroup = LANT_ATOM_GROUP
    actinideAtomGroup = ACT_ATOM_GROUP

    unsubscribe$ = new Subject<boolean>()
    colHeaderSub$ = new BehaviorSubject<ColHeaderInfo>({
        colNum: -1,
        inside: false,
    })
    colHeaderMove$ = this.colHeaderSub$.pipe(debounceTime(HEADER_STAY_AT_LEAST))

    rowHeaderSub$ = new BehaviorSubject<RowHeaderInfo>({
        rowNum: -1,
        inside: false,
    })
    rowHeaderMove$ = this.rowHeaderSub$.pipe(debounceTime(HEADER_STAY_AT_LEAST))

    atoms$: Observable<StyleAtom[]>
    selectedPhaseSub$ = new BehaviorSubject<Phase>('')

    allAtoms: StyleAtom[] = []
    currentAtom: StyleAtom | null = null
    selectedAtomCol: ColHeaderInfo | null = null
    selectedAtomRow: RowHeaderInfo | null = null
    wikiAtomName = ''

    constructor(private service: PeriodTableService) {}

    ngOnInit() {
        this.service
            .getAtoms()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(atoms => (this.allAtoms = atoms))

        const phaseAtoms$ = this.selectedPhaseSub$.pipe(
            map(selectedPhase =>
                this.allAtoms.map(atom => ({
                    ...atom,
                    solidStyle: atom.phase === 'solid' && selectedPhase !== 'solid',
                    gasStyle: atom.phase === 'gas' && selectedPhase !== 'gas',
                    unknownStyle: atom.phase === 'unknown' && selectedPhase !== 'unknown',
                    liquidStyle: atom.phase === 'liquid' && selectedPhase !== 'liquid',
                    solidSelectedStyle: atom.phase === 'solid' && selectedPhase === 'solid',
                    gasSelectedStyle: atom.phase === 'gas' && selectedPhase === 'gas',
                    unknownSelectedStyle: atom.phase === 'unknown' && selectedPhase === 'unknown',
                    liquidSelectedStyle: atom.phase === 'liquid' && selectedPhase === 'liquid',
                })),
            ),
            takeUntil(this.unsubscribe$),
        )

        const categoryAtoms$ = this.service.selectedMetal$.pipe(
            map(selectedMetal => {
                const groups = selectedMetal ? CATEGORY_GROUPS[selectedMetal] : []
                return this.allAtoms.map(atom => {
                    const grayout = groups.length > 0 && !groups.includes(CATEGORY_MAP[atom.category])
                    return {
                        ...atom,
                        grayout,
                    }
                })
            }),
            takeUntil(this.unsubscribe$),
        )

        const colAtoms$ = this.colHeaderMove$.pipe(
            map(headerMove => {
                const { colNum, inside } = headerMove
                if (colNum < 1) {
                    return this.allAtoms
                }
                return this.allAtoms.map(atom =>
                    colNum === atom.xpos && atom.ypos !== lantAtomPos && atom.ypos !== actAtomPos
                        ? atom
                        : { ...atom, blurry: inside },
                )
            }),
            takeUntil(this.unsubscribe$),
        )

        const rowAtoms$ = this.rowHeaderMove$.pipe(
            map(headerMove => {
                const { rowNum, inside } = headerMove
                if (rowNum < 1) {
                    return this.allAtoms
                }
                return this.allAtoms.map(atom => {
                    const isLangAtomSelected = rowNum === langAtonRow && atom.ypos === lantAtomPos
                    const isActAtomSelected = rowNum === actAtomRow && atom.ypos === actAtomPos
                    return rowNum === atom.ypos || isLangAtomSelected || isActAtomSelected
                        ? atom
                        : { ...atom, blurry: inside }
                })
            }),
            takeUntil(this.unsubscribe$),
        )

        this.atoms$ = merge(rowAtoms$, colAtoms$, phaseAtoms$, categoryAtoms$)
    }

    showAtomDetails(atom: StyleAtom) {
        if (atom) {
            this.currentAtom = atom
            const { xpos, ypos } = this.currentAtom
            if (ypos > MAX_ROW_INDEX) {
                this.selectedAtomRow = {
                    rowNum: ypos - 2,
                    inside: true,
                }
                this.selectedAtomCol = null
            } else {
                this.selectedAtomRow = {
                    rowNum: ypos,
                    inside: true,
                }
                this.selectedAtomCol = {
                    colNum: xpos,
                    inside: true,
                }
            }
            this.service.changeCurrentAtomCategory(this.currentAtom.category || '')
        } else {
            this.selectedAtomRow = null
            this.selectedAtomCol = null
        }
    }

    open(atomName: string) {
        this.wikiAtomName = atomName
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next(true)
        this.unsubscribe$.complete()
    }
}
