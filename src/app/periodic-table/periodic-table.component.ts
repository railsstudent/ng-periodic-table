import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core'
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs'
import { debounceTime, map, takeUntil } from 'rxjs/operators'
import {
    ACT_ATOM_GROUP,
    CATEGORY_GROUPS,
    CATEGORY_MAP,
    DESCRIPTION,
    HEADER_STAY_AT_LEAST,
    LANT_ATOM_GROUP,
    MAX_COL_INDEX,
    MAX_ROW_INDEX,
    Phase,
} from '../constant'
import { PeriodTableService } from './periodic-table.service'
import { HeaderInfo, StyleAtom, RowHeaderInfo, ColHeaderInfo } from '../types'

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

    colHeader: { index: number; description: string; selected: boolean }[]
    rowHeader: { index: number; className: string; selected: boolean }[]
    unsubscribe$ = new Subject<boolean>()
    headerSub$ = new BehaviorSubject<HeaderInfo>({
        rowNum: -1,
        colNum: -1,
        inside: false,
    })
    headerMove$ = this.headerSub$.asObservable()
    atoms$: Observable<StyleAtom[]>
    selectedPhaseSub$ = new BehaviorSubject<Phase>('')

    currentAtom: StyleAtom | null
    wikiAtomName = ''

    constructor(private service: PeriodTableService) {
        this.colHeader = Array(MAX_COL_INDEX)
            .fill(1)
            .map((_, i) => ({
                index: i + 1,
                description: i === 14 ? 'Pnictogens' : i === 15 ? 'Chalcogens' : i === 16 ? 'Halogens' : '',
                selected: false,
            }))

        this.rowHeader = [
            { index: 1, className: 'one', selected: false },
            { index: 2, className: 'two', selected: false },
            { index: 3, className: 'three', selected: false },
            { index: 4, className: 'four', selected: false },
            { index: 5, className: 'fifth', selected: false },
            { index: 6, className: 'six', selected: false },
            { index: 7, className: 'seven', selected: false },
        ]

        this.currentAtom = null
    }

    ngOnInit() {
        this.headerMove$ = this.headerSub$.pipe(debounceTime(HEADER_STAY_AT_LEAST))

        this.atoms$ = combineLatest([
            this.headerMove$,
            this.service.getAtoms(),
            this.selectedPhaseSub$,
            this.service.selectedMetal$,
        ]).pipe(
            map(([headerMove, atoms, selectedPhase, selectedMetal]) => {
                const { rowNum, colNum, inside } = headerMove
                if (rowNum >= 1) {
                    return atoms.map(atom =>
                        rowNum === atom.ypos || (rowNum === 6 && atom.ypos === 8) || (rowNum === 7 && atom.ypos === 9)
                            ? atom
                            : { ...atom, blurry: inside },
                    )
                } else if (colNum >= 1) {
                    return atoms.map(atom =>
                        colNum === atom.xpos && atom.ypos !== 8 && atom.ypos !== 9 ? atom : { ...atom, blurry: inside },
                    )
                }

                return atoms.map(atom => {
                    const groups = selectedMetal ? CATEGORY_GROUPS[selectedMetal] : []
                    const grayout = groups.length > 0 && !groups.includes(CATEGORY_MAP[atom.category])

                    return {
                        ...atom,
                        solidStyle: atom.phase === 'solid' && selectedPhase !== 'solid',
                        gasStyle: atom.phase === 'gas' && selectedPhase !== 'gas',
                        unknownStyle: atom.phase === 'unknown' && selectedPhase !== 'unknown',
                        liquidStyle: atom.phase === 'liquid' && selectedPhase !== 'liquid',
                        solidSelectedStyle: atom.phase === 'solid' && selectedPhase === 'solid',
                        gasSelectedStyle: atom.phase === 'gas' && selectedPhase === 'gas',
                        unknownSelectedStyle: atom.phase === 'unknown' && selectedPhase === 'unknown',
                        liquidSelectedStyle: atom.phase === 'liquid' && selectedPhase === 'liquid',
                        grayout,
                    }
                })
            }),
            takeUntil(this.unsubscribe$),
        )
    }

    selectRowElements(rowHeader: RowHeaderInfo) {
        this.headerSub$.next({ ...rowHeader, colNum: -1 })
    }

    selectColElements(colHeader: ColHeaderInfo) {
        this.headerSub$.next({ ...colHeader, rowNum: -1 })
    }

    showAtomDetails(atom: StyleAtom) {
        this.rowHeader.forEach(r => {
            if (r && r.selected) {
                r.selected = false
            }
        })
        this.colHeader.forEach(c => {
            if (c && c.selected) {
                c.selected = false
            }
        })
        if (atom) {
            this.currentAtom = atom
            const { xpos, ypos } = this.currentAtom
            if (ypos > MAX_ROW_INDEX) {
                this.rowHeader[ypos - 2 - 1].selected = true
            } else {
                this.rowHeader[ypos - 1].selected = true
                this.colHeader[xpos - 1].selected = true
            }
            this.service.changeCurrentAtomCategory(this.currentAtom.category || '')
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
