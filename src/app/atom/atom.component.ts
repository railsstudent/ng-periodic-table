import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    OnChanges,
    SimpleChanges,
} from '@angular/core'
import { Subject } from 'rxjs'
import { debounceTime, takeUntil } from 'rxjs/operators'
import { STAY_AT_LEAST, StyleAtom } from '../constant'
import { PeriodTableService } from '../periodic-table/periodic-table.service'

@Component({
    selector: 'app-atom',
    templateUrl: './atom.component.html',
    styleUrls: ['./atom.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomComponent implements OnInit, OnDestroy, OnChanges {
    @Input()
    data: StyleAtom

    @Output()
    hoverAtom: EventEmitter<StyleAtom | null> = new EventEmitter<StyleAtom | null>()

    backgroundStyles: any = {}
    selectedPhase: string

    mouseEnterSubject = new Subject<StyleAtom>()
    mouseLeaveSubject = new Subject<void>()
    private unsubscribe$ = new Subject<void>()

    constructor(private service: PeriodTableService, private cd: ChangeDetectorRef) {
        this.backgroundStyles = {
            blurry: false,
            'solid-selected': false,
            'liquid-selected': false,
            'gas-selected': false,
            'unknown-selected': false,
            grayout: false,
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        const { data } = changes
        const { currentValue } = data
        const { blurry = false } = currentValue
        this.backgroundStyles = {
            ...this.backgroundStyles,
            blurry,
        }
    }

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
            const alkali = metalSelected.alkali
            const alkaline = metalSelected.alkaline
            const lant = metalSelected.lant
            const actinoid = metalSelected.actinoid
            const transition = metalSelected.transition
            const postTransition = metalSelected.postTransition
            const metalloid = metalSelected.metalloid
            const nonMetal = metalSelected.nonMetal
            const nobleGas = metalSelected.nobleGas
            const allMetals = alkali && alkaline && lant && actinoid && transition && postTransition
            const allNonMetals = nonMetal && nobleGas
            ;(this.backgroundStyles['grayout'] =
                (!allMetals && alkali && this.data.category !== 'alkali-metal') ||
                (!allMetals && alkaline && this.data.category !== 'alkaline-earth-metal') ||
                (!allMetals && lant && this.data.category !== 'lanthanide') ||
                (!allMetals && actinoid && this.data.category !== 'actinide') ||
                (!allMetals && transition && this.data.category !== 'transition-metal') ||
                (!allMetals && postTransition && this.data.category !== 'post-transition-metal') ||
                (metalloid && this.data.category !== 'metalloid') ||
                (!allNonMetals && nonMetal && this.data.category !== 'nonmetal') ||
                (!allNonMetals && nobleGas && this.data.category !== 'noble-gas') ||
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
