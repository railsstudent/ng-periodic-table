import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
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
import { PeriodTableService } from '../periodic-table/periodic-table.service';
import { Atom, HighlightState } from '../shared';

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
    data: Atom;

    @Input()
    metalSelected: HighlightState;

    @Output()
    hoverAtom: EventEmitter<Atom> = new EventEmitter<Atom>();

    backgroundStyles: any = {};
    selectedPhase: string;

    mouseEnterSubject = new Subject<Atom>();
    mouseLeaveSubject = new Subject<void>();
    private unsubscribe$ = new Subject<void>();

    constructor(private service: PeriodTableService, private cd: ChangeDetectorRef) {
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
            .subscribe((atom: Atom) => this.hoverAtom.emit(atom), err => console.error(err));

        this.mouseLeaveSubject
            .pipe(
                debounceTime(STAY_AT_LEAST),
                takeUntil(this.unsubscribe$)
            )
            .subscribe(() => this.hoverAtom.emit(null), err => console.error(err));

        this.service.selectedPhase$.subscribe(selectedPhase => {
            this.selectedPhase = selectedPhase;
            this.cd.markForCheck();
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        const { data = null, metalSelected = null } = changes;

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
        const allMetals = alkali && alkaline && lant && actinoid && transition && postTransition;
        const allNonMetals = nonMetal && nobleGas;

        this.backgroundStyles = {
            blurry,
            grayout:
                (!allMetals && alkali && this.data.category !== 'alkali-metal') ||
                (!allMetals && alkaline && this.data.category !== 'alkaline-earth-metal') ||
                (!allMetals && lant && this.data.category !== 'lanthanide') ||
                (!allMetals && actinoid && this.data.category !== 'actinide') ||
                (!allMetals && transition && this.data.category !== 'transition-metal') ||
                (!allMetals && postTransition && this.data.category !== 'post-transition-metal') ||
                (metalloid && this.data.category !== 'metalloid') ||
                (!allNonMetals && nonMetal && this.data.category !== 'nonmetal') ||
                (!allNonMetals && nobleGas && this.data.category !== 'noble-gas') ||
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
        this.mouseEnterSubject.next(this.data);
    }

    debounceMouseLeave() {
        this.mouseLeaveSubject.next();
    }
}
