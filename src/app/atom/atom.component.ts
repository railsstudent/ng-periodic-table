import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core'
import { Subject } from 'rxjs'
import { debounceTime, takeUntil } from 'rxjs/operators'
import { STAY_AT_LEAST } from '../constant'
import { PeriodTableService } from '../periodic-table/'
import { StyleAtom } from '../types'

@Component({
    selector: 'app-atom',
    templateUrl: './atom.component.html',
    styleUrls: ['./atom.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomComponent implements OnInit, OnDestroy {
    @Input()
    data: StyleAtom

    @Output()
    hoverAtom: EventEmitter<StyleAtom | null> = new EventEmitter<StyleAtom | null>()

    backgroundStyles: {
        grayout: boolean
    } = {
        grayout: false,
    }
    selectedPhase: string

    mouseEnterSubject = new Subject<StyleAtom>()
    mouseLeaveSubject = new Subject<void>()
    private unsubscribe$ = new Subject<void>()

    constructor(private service: PeriodTableService, private cd: ChangeDetectorRef) {}

    ngOnInit() {
        this.mouseEnterSubject
            .pipe(
                debounceTime(STAY_AT_LEAST),
                takeUntil(this.unsubscribe$),
            )
            .subscribe((atom: StyleAtom) => this.hoverAtom.emit(atom), (err: unknown) => console.error(err))

        this.mouseLeaveSubject
            .pipe(
                debounceTime(STAY_AT_LEAST),
                takeUntil(this.unsubscribe$),
            )
            .subscribe(() => this.hoverAtom.emit(null), (err: unknown) => console.error(err))

        this.service.selectedMetal$.subscribe(metalSelected => {
            const {
                alkali,
                alkaline,
                lant,
                actinoid,
                transition,
                postTransition,
                metalloid,
                nonMetal,
                nobleGas,
                allMetals,
                allNonMetals,
            } = metalSelected
            ;(this.backgroundStyles['grayout'] =
                (alkali && this.data.category !== 'alkali-metal') ||
                (alkaline && this.data.category !== 'alkaline-earth-metal') ||
                (lant && this.data.category !== 'lanthanide') ||
                (actinoid && this.data.category !== 'actinide') ||
                (transition && this.data.category !== 'transition-metal') ||
                (postTransition && this.data.category !== 'post-transition-metal') ||
                (metalloid && this.data.category !== 'metalloid') ||
                (nonMetal && this.data.category !== 'nonmetal') ||
                (nobleGas && this.data.category !== 'noble-gas') ||
                (allMetals && ['metalloid', 'nonmetal', 'noble-gas'].includes(this.data.category)) ||
                (allNonMetals &&
                    [
                        'alkali-metal',
                        'alkaline-earth-metal',
                        'lanthanide',
                        'actinide',
                        'transition-metal',
                        'post-transition-metal',
                        'metalloid',
                    ].includes(this.data.category))),
                this.cd.markForCheck()
        })
    }

    ngOnDestroy() {
        if (this.unsubscribe$) {
            this.unsubscribe$.next()
            this.unsubscribe$.complete()
        }
    }

    debounceMouseEnter() {
        this.mouseEnterSubject.next(this.data)
    }

    debounceMouseLeave() {
        this.mouseLeaveSubject.next()
    }
}
