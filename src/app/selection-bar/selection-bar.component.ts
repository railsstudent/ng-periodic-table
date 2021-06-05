import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core'
import { fromEvent, merge, Observable, Subject } from 'rxjs'
import { map, takeUntil, tap } from 'rxjs/operators'
import { Category, CATEGORY_GROUPS, CATEGORY_MAP } from '../constant'
import { PeriodTableService } from '../periodic-table'

@Component({
    selector: 'app-selection-bar',
    templateUrl: './selection-bar.component.html',
    styleUrls: ['./selection-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionBarComponent implements OnDestroy, OnInit {
    hoverCategory: Category | null = null
    unsubscribe$ = new Subject()
    hoverCategoryGroup: string[] = []

    @ViewChild('alkali', { static: true })
    alkali: ElementRef

    @ViewChild('alkaline', { static: true })
    alkaline: ElementRef

    @ViewChild('lant', { static: true })
    lant: ElementRef

    @ViewChild('actinoid', { static: true })
    actinoid: ElementRef

    @ViewChild('transition', { static: true })
    transition: ElementRef

    @ViewChild('postTransition', { static: true })
    postTransition: ElementRef

    @ViewChild('metalloid', { static: true })
    metalloid: ElementRef

    @ViewChild('nonMetal', { static: true })
    nonMetal: ElementRef

    @ViewChild('nobleGas', { static: true })
    nobleGas: ElementRef

    @ViewChild('allMetals', { static: true })
    allMetals: ElementRef

    @ViewChild('allNonMetals', { static: true })
    allNonMetals: ElementRef

    constructor(private service: PeriodTableService, private cd: ChangeDetectorRef) {}

    ngOnInit() {
        const nativeElements = {
            [Category.alkali]: this.alkali.nativeElement,
            [Category.alkaline]: this.alkaline.nativeElement,
            [Category.actinoid]: this.actinoid.nativeElement,
            [Category.lant]: this.lant.nativeElement,
            [Category.metalloid]: this.metalloid.nativeElement,
            [Category.nobleGas]: this.nobleGas.nativeElement,
            [Category.nonMetal]: this.nonMetal.nativeElement,
            [Category.postTransition]: this.postTransition.nativeElement,
            [Category.transition]: this.transition.nativeElement,
            [Category.allMetals]: this.allMetals.nativeElement,
            [Category.allNonMetals]: this.allNonMetals.nativeElement,
        }

        const btnMouseEnters$: Observable<Category | null>[] = []
        const btnMouseLeaves$: Observable<Category | null>[] = []

        Object.keys(nativeElements).forEach(cat => {
            const nativeElement = nativeElements[cat]
            btnMouseEnters$.push(
                fromEvent(nativeElement, 'mouseenter').pipe(
                    map(() => Category[cat as keyof Category]),
                    takeUntil(this.unsubscribe$),
                ),
            )
            btnMouseLeaves$.push(
                fromEvent(nativeElement, 'mouseleave').pipe(
                    map(() => null),
                    takeUntil(this.unsubscribe$),
                ),
            )
        })

        merge(...btnMouseEnters$, ...btnMouseLeaves$)
            .pipe(
                tap(current => this.service.setCategory(current)),
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
