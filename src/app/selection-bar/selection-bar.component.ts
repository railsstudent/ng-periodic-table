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
import { distinctUntilChanged, filter, map, mapTo, share, takeUntil, tap } from 'rxjs/operators';
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

const INIT_GRAY: HighlightState = {
    alkali: true,
    alkaline: true,
    lant: true,
    actinoid: true,
    transition: true,
    postTransition: true,
    metalloid: true,
    nonMetal: true,
    nobleGas: true,
};

@Component({
    selector: 'app-selection-bar',
    templateUrl: './selection-bar.component.html',
    styleUrls: ['./selection-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionBarComponent implements OnDestroy, AfterViewInit {
    @Output()
    highlightElement: EventEmitter<HighlightState> = new EventEmitter<HighlightState>();

    // @Input()
    // currentAtomCategory: string;

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
            const $el = document.getElementById(category);
            const o = fromEvent($el, 'mouseenter').pipe(
                distinctUntilChanged(),
                mapTo({ [category]: true }),
                takeUntil(this.unsubscribe$)
            );
            return o;
        });

        const btnMouseLeave$ = CATEGORIES.map(category => {
            const $el = document.getElementById(category);
            const o = fromEvent($el, 'mouseleave').pipe(
                distinctUntilChanged(),
                mapTo({ [category]: false }),
                takeUntil(this.unsubscribe$)
            );
            return o;
        });
        const $allMetals = document.getElementById('all-metals');
        const $allNonMetals = document.getElementById('all-nonmetals');

        // mouse hovers category
        const categorySelection$ = merge(...btnMouseEnter$, ...btnMouseLeave$).pipe(share());
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
                    const key = Object.keys(current)[0];
                    return { [key]: !current[key] };
                }),
                takeUntil(this.unsubscribe$)
            )
            .subscribe(currentSelection => {
                this.grayButtonStyle = { ...INIT_GRAY, ...currentSelection };
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

        fromEvent($allMetals, 'mouseenter')
            .pipe(
                map(() => ({
                    ...INIT_HIGHLIGHT_STATE,
                    alkali: true,
                    alkaline: true,
                    lant: true,
                    actinoid: true,
                    transition: true,
                    postTransition: true,
                })),
                tap(results => this.highlightElement.emit(results)),
                takeUntil(this.unsubscribe$)
            )
            .subscribe(results => {
                this.highlightState = results;
                this.cd.markForCheck();
            });

        fromEvent($allMetals, 'mouseleave')
            .pipe(
                map(() => INIT_HIGHLIGHT_STATE),
                tap(results => this.highlightElement.emit(results)),
                takeUntil(this.unsubscribe$)
            )
            .subscribe(results => {
                this.highlightState = results;
                this.cd.markForCheck();
            });

        fromEvent($allNonMetals, 'mouseenter')
            .pipe(
                map(() => ({
                    ...INIT_HIGHLIGHT_STATE,
                    nonMetal: true,
                    nobleGas: true,
                })),
                tap(results => this.highlightElement.emit(results)),
                takeUntil(this.unsubscribe$)
            )
            .subscribe(results => {
                this.highlightState = results;
                this.cd.markForCheck();
            });

        fromEvent($allNonMetals, 'mouseleave')
            .pipe(
                map(() => INIT_HIGHLIGHT_STATE),
                tap(results => this.highlightElement.emit(results)),
                takeUntil(this.unsubscribe$)
            )
            .subscribe(results => {
                this.highlightState = results;
                this.cd.markForCheck();
            });

        this.service.currentAtomCategory$.subscribe(v => {
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
