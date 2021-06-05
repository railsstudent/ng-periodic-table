import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { Category } from '../constant'
import { StyleAtom } from '../types'

@Injectable({
    providedIn: 'root',
})
export class PeriodTableService {
    private currentAtomCategorySub$ = new BehaviorSubject<string>('')
    currentAtomCategory$ = this.currentAtomCategorySub$.asObservable()

    private selectedMetalSub$ = new BehaviorSubject<Category | null>(null)
    selectedMetal$ = this.selectedMetalSub$.asObservable()

    constructor(private http: HttpClient) {}

    changeCurrentAtomCategory(atomCategory: string) {
        this.currentAtomCategorySub$.next(atomCategory)
    }

    setCategory(category: Category | null) {
        this.selectedMetalSub$.next(category)
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
                    solidSelectedStyle: false,
                    gasSelectedStyle: false,
                    liquidSelectedStyle: false,
                    unknownSelectedStyle: false,
                    grayout: false,
                })),
            ),
            shareReplay({ bufferSize: 1, refCount: true }),
        )
    }
}
