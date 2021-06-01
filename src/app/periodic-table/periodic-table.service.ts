import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { shareReplay } from 'rxjs/operators'
import { Atom, HighlightState } from '../constant'

@Injectable({
    providedIn: 'root',
})
export class PeriodTableService {
    private currentAtomCategorySub$ = new BehaviorSubject<string>('')
    currentAtomCategory$ = this.currentAtomCategorySub$.asObservable()

    private selectedMetalSub$ = new Subject<HighlightState>()
    selectedMetal$ = this.selectedMetalSub$.asObservable()

    private selectedPhaseSub$ = new Subject<string>()
    selectedPhase$ = this.selectedPhaseSub$.asObservable()

    constructor(private http: HttpClient) {}

    changeCurrentAtomCategory(atomCategory: string) {
        this.currentAtomCategorySub$.next(atomCategory)
    }

    setHighlightState(highlightState: HighlightState) {
        this.selectedMetalSub$.next(highlightState)
    }

    setSelectedPhase(phase: string) {
        this.selectedPhaseSub$.next(phase)
    }

    getAtoms(): Observable<Atom[]> {
        return this.http
            .get<Atom[]>('./assets/periodic-table.json')
            .pipe(shareReplay({ bufferSize: 1, refCount: true }))
    }
}
