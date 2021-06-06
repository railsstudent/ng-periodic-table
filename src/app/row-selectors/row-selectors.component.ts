import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core'
import { RowHeaderInfo } from '../types'

@Component({
    selector: 'app-row-selectors',
    template: `
        <div
            *ngFor="let o of rowHeader"
            class="periodic-row-num {{ o.className }}"
            (mouseenter)="updateRowHeaderSelected(o.index, true)"
            (mouseleave)="updateRowHeaderSelected(o.index, false)"
            [class.selected]="o.selected"
        >
            <span class="index">{{ o.index }}</span>
        </div>
    `,
    styleUrls: ['./row-selectors.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowSelectorsComponent implements OnChanges {
    @Input()
    selectedAtomRow: number | null = null

    @Output()
    selectedRow = new EventEmitter<RowHeaderInfo>()

    rowHeader = [
        { index: 1, className: 'one', selected: false },
        { index: 2, className: 'two', selected: false },
        { index: 3, className: 'three', selected: false },
        { index: 4, className: 'four', selected: false },
        { index: 5, className: 'fifth', selected: false },
        { index: 6, className: 'six', selected: false },
        { index: 7, className: 'seven', selected: false },
    ]

    ngOnChanges(changes: SimpleChanges): void {
        const { selectedAtomRow } = changes
        const { currentValue } = selectedAtomRow
        this.unselectAllHeaders()
        if (currentValue) {
            this.rowHeader[currentValue - 1].selected = true
        }
    }

    updateRowHeaderSelected(rowNum: number, inside: boolean) {
        this.unselectAllHeaders()
        this.rowHeader[rowNum - 1].selected = inside
        this.selectedRow.emit({ rowNum: inside ? rowNum : -1, inside })
    }

    unselectAllHeaders() {
        this.rowHeader.forEach(r => (r.selected = false))
    }
}
