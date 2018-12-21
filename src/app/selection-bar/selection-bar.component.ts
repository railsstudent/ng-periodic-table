import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnDestroy,
    Output,
} from '@angular/core';
import { fromEvent, merge, Subject } from 'rxjs';
import { filter, map, mapTo, share, takeUntil, tap } from 'rxjs/operators';
import { PeriodTableService } from '../periodic-table/periodic-table.service';
import { HighlightState } from '../shared/';

const CATEGORY_MAP = {
    'alkali-metal': 'alkali',
    'alkaline-earth-metal': 'alkaline',
    lanthanide: 'lant',
    actinide: 'actinoid',
    'transition-metal': 'transition',
    'post-transition-metal': 'postTransition',
    metalloid: 'metalloid',
    nonmetal: 'nonMetal',
    'noble-gas': 'nobleGas',
};

const CATEGORIES = [
    'alkali',
    'alkaline',
    'lant',
    'actinoid',
    'transition',
    'postTransition',
    'metalloid',
    'nonMetal',
    'nobleGas',
];

const INIT_HIGHLIGHT_STATE: HighlightState = {
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

@Component({
    selector: 'app-selection-bar',
    templateUrl: './selection-bar.component.html',
    styleUrls: ['./selection-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionBarComponent implements OnDestroy, AfterViewInit {
    @Output()
    highlightElement = new EventEmitter<HighlightState>();

    highlightState: HighlightState;
    grayButtonStyle = { ...this.getGrayColor(false) };
    unsubscribe$ = new Subject();

    constructor(private service: PeriodTableService, private cd: ChangeDetectorRef) {
        this.highlightState = {
            ...INIT_HIGHLIGHT_STATE,
        };
    }

    getGrayColor(isGray: boolean) {
        return CATEGORIES.reduce((acc, key) => {
            acc[key] = isGray;
            return acc;
        }, {});
    }

    ngAfterViewInit() {
        const btnMouseEnter$ = CATEGORIES.map(category => {
            const $el = document.getElementById(category);
            const o = fromEvent($el, 'mouseenter').pipe(
                mapTo({ [category]: true }),
                takeUntil(this.unsubscribe$)
            );
            return o;
        });

        const btnMouseLeave$ = CATEGORIES.map(category => {
            const $el = document.getElementById(category);
            const o = fromEvent($el, 'mouseleave').pipe(
                mapTo({ [category]: false }),
                takeUntil(this.unsubscribe$)
            );
            return o;
        });

        const $allMetals = document.getElementById('all-metals');
        const $allNonMetals = document.getElementById('all-nonmetals');

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

        const metalsLeave$ = fromEvent($allMetals, 'mouseleave').pipe(mapTo({}));
        const allMetalsLeave$ = fromEvent($allNonMetals, 'mouseleave').pipe(mapTo({}));

        // mouse hovers category
        const categorySelection$ = merge(
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
                tap(highlightState => this.highlightElement.emit(highlightState)),
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
                    return current[key];
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
                this.grayButtonStyle = { ...this.getGrayColor(false) };
                if (numKeys === 1) {
                    this.grayButtonStyle = { ...this.getGrayColor(true), ...currentSelection };
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
                this.grayButtonStyle = { ...this.getGrayColor(false) };
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
        return Object.keys(this.highlightState).filter(k => this.highlightState[k] === true).length;
    }

    ngOnDestroy() {
        if (this.unsubscribe$) {
            this.unsubscribe$.next();
            this.unsubscribe$.complete();
        }
    }
}
