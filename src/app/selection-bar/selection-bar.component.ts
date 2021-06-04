import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core'
import { fromEvent, merge, Subject } from 'rxjs'
import { FromEventTarget } from 'rxjs/internal/observable/fromEvent'
import { map, share, takeUntil, tap } from 'rxjs/operators'
import { Category, CATEGORY_GROUPS, CATEGORY_MAP } from '../constant'
import { PeriodTableService } from '../periodic-table'

@Component({
    selector: 'app-selection-bar',
    templateUrl: './selection-bar.component.html',
    styleUrls: ['./selection-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionBarComponent implements OnDestroy, AfterViewInit {
    hoverCategory: Category | null = null
    unsubscribe$ = new Subject()
    hoverCategoryGroup: string[] = []

    constructor(private service: PeriodTableService, private cd: ChangeDetectorRef) {}

    ngAfterViewInit() {
        const categories = Object.values(CATEGORY_MAP)
        const btnMouseEnter$ = categories.map(category => {
            const $el = document.getElementById(category) as FromEventTarget<Event>
            const o = fromEvent($el, 'mouseenter').pipe(
                map(() => category),
                takeUntil(this.unsubscribe$),
            )
            return o
        })

        const btnMouseLeave$ = categories.map(category => {
            const $el = document.getElementById(category) as FromEventTarget<Event>
            const o = fromEvent($el, 'mouseleave').pipe(
                map(() => null),
                takeUntil(this.unsubscribe$),
            )
            return o
        })

        const $allMetals = document.getElementById('all-metals') as FromEventTarget<Event>
        const $allNonMetals = document.getElementById('all-nonmetals') as FromEventTarget<Event>

        const allMetalsEnter$ = fromEvent($allMetals, 'mouseenter').pipe(map(() => Category.allMetals))

        const allNonMetalsEnter$ = fromEvent($allNonMetals, 'mouseenter').pipe(map(() => Category.allNonMetals))

        const metalsLeave$ = fromEvent($allMetals, 'mouseleave').pipe(map(() => null))
        const allMetalsLeave$ = fromEvent($allNonMetals, 'mouseleave').pipe(map(() => null))

        // mouse hovers category
        const categorySelection$ = merge<Category>(
            ...btnMouseEnter$,
            ...btnMouseLeave$,
            allMetalsEnter$,
            allNonMetalsEnter$,
            metalsLeave$,
            allMetalsLeave$,
        ).pipe(share())

        categorySelection$
            .pipe(
                tap(current => this.service.setHighlightState(current)),
                takeUntil(this.unsubscribe$),
            )
            .subscribe(hoverCategory => {
                this.hoverCategory = hoverCategory
                this.hoverCategoryGroup = hoverCategory ? CATEGORY_GROUPS[hoverCategory].map(cat => cat.toString()) : []
                this.cd.markForCheck()
            })

        this.service.currentAtomCategory$.pipe(takeUntil(this.unsubscribe$)).subscribe(strCategory => {
            const category = CATEGORY_MAP[strCategory]
            if (category) {
                this.hoverCategory = category
                this.cd.markForCheck()
            }
        })
    }

    ngOnDestroy() {
        if (this.unsubscribe$) {
            this.unsubscribe$.next()
            this.unsubscribe$.complete()
        }
    }
}
