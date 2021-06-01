import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core'
import { fromEvent, merge, Subject } from 'rxjs'
import { mapTo, takeUntil } from 'rxjs/operators'
import { Phase } from '../constant'
import { PeriodTableService } from '../periodic-table'

@Component({
    selector: 'app-phase',
    template: `
        <div class="{{ type }}" [class.selected]="selected">{{ symbol }}</div>
    `,
    styles: [
        `
            :host {
                display: block;
            }

            .solid {
                color: #000;
            }

            .liquid {
                color: #0000dd;
            }

            .gas {
                color: #990000;
            }

            .unknown {
                color: #667766;
            }

            .solid,
            .liquid,
            .gas,
            .unknown {
                padding: 2px;
                font-size: 1em;
                font-weight: bold;
            }

            .solid,
            .liquid,
            .gas,
            .unknown {
                width: 50%;
                margin: 0 0 0 auto;
                border: 1px solid #000;
                text-align: center;
                cursor: pointer;
            }

            .solid.selected,
            .liquid.selected,
            .unknown.selected,
            .gas.selected {
                color: #fff;
            }

            .solid.selected {
                background: #171717;
            }

            .liquid.selected {
                background: #2d51e1;
            }

            .gas.selected {
                background: #923a49;
            }

            .unknown.selected {
                background: #898989;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppPhaseComponent implements AfterViewInit, OnDestroy {
    @Input()
    symbol: string

    @Input()
    type: Phase

    unsubscribe$ = new Subject<boolean>()
    selected = false

    constructor(private service: PeriodTableService, private cd: ChangeDetectorRef) {}

    ngAfterViewInit() {
        const $el = document.getElementsByClassName(this.type)[0]

        const enter$ = fromEvent($el, 'mouseenter').pipe(
            mapTo({
                selected: true,
                type: this.type,
            }),
        )

        const leave$ = fromEvent($el, 'mouseleave').pipe(
            mapTo({
                selected: false,
                type: '' as Phase,
            }),
        )

        merge(enter$, leave$)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(({ selected, type }) => {
                this.selected = selected
                this.service.setSelectedPhase(type)
                this.cd.markForCheck()
            })
    }

    ngOnDestroy() {
        this.unsubscribe$.next(true)
        this.unsubscribe$.complete()
    }
}
