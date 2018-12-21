import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HighlightState } from './../shared/interfaces';

@Injectable({
    providedIn: 'root',
})
export class PeriodTableService {
    private currentAtomCategorySub$ = new BehaviorSubject<string>('');
    currentAtomCategory$ = this.currentAtomCategorySub$.asObservable();

    private selectedMetalSub$ = new Subject<HighlightState>();
    selectedMetal$ = this.selectedMetalSub$.asObservable();

    changeCurrentAtomCategory(atomCategory: string) {
        this.currentAtomCategorySub$.next(atomCategory);
    }

    setHighlightState(highlightState: HighlightState) {
        this.selectedMetalSub$.next(highlightState);
    }
}
