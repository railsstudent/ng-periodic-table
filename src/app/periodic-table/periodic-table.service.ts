import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HighlightState } from '../constant';

@Injectable({
    providedIn: 'root',
})
export class PeriodTableService {
    private currentAtomCategorySub$ = new BehaviorSubject<string>('');
    currentAtomCategory$ = this.currentAtomCategorySub$.asObservable();

    private selectedMetalSub$ = new Subject<HighlightState>();
    selectedMetal$ = this.selectedMetalSub$.asObservable();

    private selectedPhaseSub$ = new Subject<string>();
    selectedPhase$ = this.selectedPhaseSub$.asObservable();

    changeCurrentAtomCategory(atomCategory: string) {
        this.currentAtomCategorySub$.next(atomCategory);
    }

    setHighlightState(highlightState: HighlightState) {
        this.selectedMetalSub$.next(highlightState);
    }

    setSelectedPhase(phase: string) {
        this.selectedPhaseSub$.next(phase);
    }
}
