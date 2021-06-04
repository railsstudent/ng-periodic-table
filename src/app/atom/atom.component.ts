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
import { CATEGORY_GROUPS, CATEGORY_MAP, STAY_AT_LEAST } from '../constant'
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
            if (metalSelected) {
                const groups = CATEGORY_GROUPS[metalSelected]
                this.backgroundStyles['grayout'] = !groups.includes(CATEGORY_MAP[this.data.category])
            } else {
                this.backgroundStyles['grayout'] = false
            }
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
