import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { HighlightState, Phase, StyleAtom } from '../constant'

@Injectable({
    providedIn: 'root',
})
export class PeriodTableService {
    private currentAtomCategorySub$ = new BehaviorSubject<string>('')
    currentAtomCategory$ = this.currentAtomCategorySub$.asObservable()

    private selectedMetalSub$ = new Subject<HighlightState>()
    selectedMetal$ = this.selectedMetalSub$.asObservable()

    private selectedPhaseSub$ = new Subject<Phase>()
    selectedPhase$ = this.selectedPhaseSub$.asObservable()

    constructor(private http: HttpClient) {}

    changeCurrentAtomCategory(atomCategory: string) {
        this.currentAtomCategorySub$.next(atomCategory)
    }

    setHighlightState(highlightState: HighlightState) {
        this.selectedMetalSub$.next(highlightState)
    }

    setSelectedPhase(phase: Phase) {
        this.selectedPhaseSub$.next(phase)
    }

    getAtoms(): Observable<StyleAtom[]> {
        return this.http.get<StyleAtom[]>('./assets/periodic-table.json').pipe(
            map(atoms =>
                atoms.map(atom => ({
                    ...atom,
                    solidStyle: false,
                    gasStyle: false,
                    liquidStyle: false,
                    unknownStyle: false,
                })),
            ),
            shareReplay({ bufferSize: 1, refCount: true }),
        )
    }
}
