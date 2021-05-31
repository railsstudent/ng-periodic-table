import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { fromEvent, merge, Subject } from 'rxjs';
import { FromEventTarget } from 'rxjs/internal/observable/fromEvent';
import { filter, map, mapTo, share, takeUntil, tap } from 'rxjs/operators';
import { CATEGORIES, CATEGORY_MAP, HighlightState, INIT_HIGHLIGHT_STATE } from '../constant';
import { PeriodTableService } from '../periodic-table';

@Component({
    selector: 'app-selection-bar',
    templateUrl: './selection-bar.component.html',
    styleUrls: ['./selection-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionBarComponent implements OnDestroy, AfterViewInit {
    highlightState: HighlightState;
    grayButtonStyle = {
        alkali: false,
        alkaline: false,
        lant: false,
        actinoid: false,
        transition: false,
        postTransition: false,
        metalloid: false,
        nonMetal: false,
        nobleGas: false,
    };
    unsubscribe$ = new Subject();

    constructor(private service: PeriodTableService, private cd: ChangeDetectorRef) {
        this.highlightState = {
            ...INIT_HIGHLIGHT_STATE,
        };
    }

    ngAfterViewInit() {
        const btnMouseEnter$ = CATEGORIES.map(category => {
            const $el = document.getElementById(category) as FromEventTarget<Event>;
            const o = fromEvent($el, 'mouseenter').pipe(
                mapTo({ [category]: true }),
                takeUntil(this.unsubscribe$)
            );
            return o;
        });

        const btnMouseLeave$ = CATEGORIES.map(category => {
            const $el = document.getElementById(category) as FromEventTarget<Event>;
            const o = fromEvent($el, 'mouseleave').pipe(
                mapTo({ [category]: false }),
                takeUntil(this.unsubscribe$)
            );
            return o;
        });

        const $allMetals = document.getElementById('all-metals') as FromEventTarget<Event>;
        const $allNonMetals = document.getElementById('all-nonmetals') as FromEventTarget<Event>;

        const allMetalsEnter$ = fromEvent($allMetals, 'mouseenter').pipe(
            mapTo({
                alkali: true,
                alkaline: true,
                lant: true,
                actinoid: true,
                transition: true,
                postTransition: true,
            })
        );

        const allNonMetalsEnter$ = fromEvent($allNonMetals, 'mouseenter').pipe(
            mapTo({
                nonMetal: true,
                nobleGas: true,
            })
        );

        const metalsLeave$ = fromEvent($allMetals, 'mouseleave').pipe(mapTo(INIT_HIGHLIGHT_STATE));
        const allMetalsLeave$ = fromEvent($allNonMetals, 'mouseleave').pipe(mapTo(INIT_HIGHLIGHT_STATE));

        // mouse hovers category
        const categorySelection$ = merge<HighlightState>(
            ...btnMouseEnter$,
            ...btnMouseLeave$,
            allMetalsEnter$,
            allNonMetalsEnter$,
            metalsLeave$,
            allMetalsLeave$
        ).pipe(share());

        categorySelection$
            .pipe(
                map(current => ({ ...INIT_HIGHLIGHT_STATE, ...current })),
                tap(highlightState => this.service.setHighlightState(highlightState)),
                takeUntil(this.unsubscribe$)
            )
            .subscribe(highlightState => {
                this.highlightState = highlightState;
                this.cd.markForCheck();
            });

        // gray out unselected categories
        categorySelection$
            .pipe(
                filter(current => {
                    const key = Object.keys(current)[0];
                    const xxx = key as keyof HighlightState;
                    return current[xxx];
                }),
                map(current => {
                    return Object.keys(current).reduce((acc, key) => {
                        acc[key] = !current[key];
                        return acc;
                    }, {});
                }),
                takeUntil(this.unsubscribe$)
            )
            .subscribe(currentSelection => {
                const numKeys = Object.keys(currentSelection).length;
                this.grayButtonStyle = {
                    alkali: false,
                    alkaline: false,
                    lant: false,
                    actinoid: false,
                    transition: false,
                    postTransition: false,
                    metalloid: false,
                    nonMetal: false,
                    nobleGas: false,
                };
                if (numKeys === 1) {
                    const key = Object.keys(currentSelection)[0];
                    this.grayButtonStyle[key] = currentSelection[key];
                }
                this.cd.markForCheck();
            });

        // remove gray background
        categorySelection$
            .pipe(
                filter(current => {
                    const k = Object.keys(current)[0];
                    return !current[k];
                }),
                takeUntil(this.unsubscribe$)
            )
            .subscribe(() => {
                this.grayButtonStyle = {
                    alkali: false,
                    alkaline: false,
                    lant: false,
                    actinoid: false,
                    transition: false,
                    postTransition: false,
                    metalloid: false,
                    nonMetal: false,
                    nobleGas: false,
                };
                this.cd.markForCheck();
            });

        this.service.currentAtomCategory$.pipe(takeUntil(this.unsubscribe$)).subscribe(v => {
            const category = CATEGORY_MAP[v];
            if (category) {
                this.highlightState = { ...INIT_HIGHLIGHT_STATE, [category]: true };
                this.cd.markForCheck();
            }
        });
    }

    numHighlightState() {
        return Object.keys(this.highlightState).filter(k => this.highlightState[k as keyof HighlightState] === true)
            .length;
    }

    ngOnDestroy() {
        if (this.unsubscribe$) {
            this.unsubscribe$.next();
            this.unsubscribe$.complete();
        }
    }
}
