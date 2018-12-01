import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { get, includes } from 'lodash-es';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { HighlightState } from '../shared';

// in milliseconds
const STAY_AT_LEAST = 250;

@Component({
    selector: 'app-atom',
    templateUrl: './atom.component.html',
    styleUrls: ['./atom.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomComponent implements OnInit, OnChanges, OnDestroy {
    @Input()
    data: any;

    @Input()
    metalSelected: HighlightState;

    @Input()
    selectAllMetals: boolean;

    @Input()
    selectAllNonmetals: boolean;

    @Input()
    selectedPhase: string;

    @Output()
    hoverAtom: EventEmitter<number> = new EventEmitter<number>();

    backgroundStyles: any = {};

    mouseEnterSubject = new Subject<number>();
    mouseLeaveSubject = new Subject<number>();
    private unsubscribe$ = new Subject<void>();

    constructor() {
        this.backgroundStyles = {
            blurry: false,
            'solid-selected': false,
            'liquid-selected': false,
            'gas-selected': false,
            'unknown-selected': false,
            grayout: false,
        };
    }

    ngOnInit() {
        this.mouseEnterSubject
            .pipe(
                debounceTime(STAY_AT_LEAST),
                takeUntil(this.unsubscribe$)
            )
            .subscribe((value: number) => this.hoverAtom.emit(value), err => console.error(err));

        this.mouseLeaveSubject
            .pipe(
                debounceTime(STAY_AT_LEAST),
                takeUntil(this.unsubscribe$)
            )
            .subscribe(() => this.hoverAtom.emit(null), err => console.error(err));
    }

    ngOnChanges(changes: SimpleChanges) {
        const {
            data = null,
            metalSelected = null,
            selectAllMetals = null,
            selectAllNonmetals = null,
            selectedPhase = null,
        } = changes;

        const blurry = get(data, 'currentValue.blurry', false);
        const alkali = get(metalSelected, 'currentValue.alkali', false);
        const alkaline = get(metalSelected, 'currentValue.alkaline', false);
        const lant = get(metalSelected, 'currentValue.lant', false);
        const actinoid = get(metalSelected, 'currentValue.actinoid', false);
        const transition = get(metalSelected, 'currentValue.transition', false);
        const postTransition = get(metalSelected, 'currentValue.postTransition', false);
        const metalloid = get(metalSelected, 'currentValue.metalloid', false);
        const nonMetal = get(metalSelected, 'currentValue.nonMetal', false);
        const nobleGas = get(metalSelected, 'currentValue.nobleGas', false);
        const allMetals = get(selectAllMetals, 'currentValue', false);
        const allNonMetals = get(selectAllNonmetals, 'currentValue', false);
        const currentPhase = get(selectedPhase, 'currentValue', '');

        this.backgroundStyles = {
            blurry,
            'solid-selected': currentPhase === 'solid' && this.data.phase === 'solid',
            'liquid-selected': currentPhase === 'liquid' && this.data.phase === 'liquid',
            'gas-selected': currentPhase === 'gas' && this.data.phase === 'gas',
            'unknown-selected': currentPhase === 'unknown' && this.data.phase === 'unknown',
            grayout:
                (alkali && this.data.category !== 'alkali-metal') ||
                (alkaline && this.data.category !== 'alkaline-earth-metal') ||
                (lant && this.data.category !== 'lanthanide') ||
                (actinoid && this.data.category !== 'actinide') ||
                (transition && this.data.category !== 'transition-metal') ||
                (postTransition && this.data.category !== 'post-transition-metal') ||
                (metalloid && this.data.category !== 'metalloid') ||
                (nonMetal && this.data.category !== 'nonmetal') ||
                (nobleGas && this.data.category !== 'noble-gas') ||
                (allMetals && includes(['metalloid', 'nonmetal', 'noble-gas'], this.data.category)) ||
                (allNonMetals &&
                    includes(
                        [
                            'alkali-metal',
                            'alkaline-earth-metal',
                            'lanthanide',
                            'actinide',
                            'transition-metal',
                            'post-transition-metal',
                            'metalloid',
                        ],
                        this.data.category
                    )),
        };
    }

    ngOnDestroy() {
        if (this.unsubscribe$) {
            this.unsubscribe$.next();
            this.unsubscribe$.complete();
        }
    }

    debounceMouseEnter() {
        this.mouseEnterSubject.next(this.data.number);
    }

    debounceMouseLeave() {
        this.mouseLeaveSubject.next(this.data.number);
    }
}
