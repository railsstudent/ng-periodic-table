import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PeriodTableService {
    private currentAtomCategorySub$ = new BehaviorSubject<string>('');
    currentAtomCategory$ = this.currentAtomCategorySub$.asObservable();

    changeCurrentAtomCategory(atomCategory: string) {
        this.currentAtomCategorySub$.next(atomCategory);
    }
}
