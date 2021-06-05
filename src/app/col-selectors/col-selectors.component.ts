import { Component, EventEmitter, Output } from '@angular/core'
import { MAX_COL_INDEX } from '../constant'
import { ColHeaderInfo } from '../types'

const COLUMN_Pnictogens = 14
const COLUMN_Chalcogens = 15
const COLUMN_Halogens = 16

@Component({
    selector: 'app-col-selectors',
    template: `
        <ng-container>
            <div class="periodic-col-num">&nbsp;</div>
            <div
                class="periodic-col-num"
                *ngFor="let o of colHeader"
                (mouseenter)="updateColHeaderSelected(o.index, true)"
                (mouseleave)="updateColHeaderSelected(o.index, false)"
                [class.selected]="o.selected"
            >
                <span class="index">{{ o.index }}</span> <span class="description">{{ o.description }}</span>
            </div>
        </ng-container>
    `,
    styleUrls: ['./col-selectors.component.scss'],
})
export class ColSelectorsComponent {
    @Output()
    selectedCol = new EventEmitter<ColHeaderInfo>()

    colHeader = Array(MAX_COL_INDEX)
        .fill(1)
        .map((_, i) => ({
            index: i + 1,
            description:
                i === COLUMN_Pnictogens
                    ? 'Pnictogens'
                    : i === COLUMN_Chalcogens
                    ? 'Chalcogens'
                    : i === COLUMN_Halogens
                    ? 'Halogens'
                    : '',
            selected: false,
        }))

    updateColHeaderSelected(colNum: number, inside: boolean) {
        this.unselectAllHeaders()
        this.colHeader[colNum - 1].selected = inside
        this.selectedCol.emit({
            colNum: inside ? colNum : -1,
            inside,
        })
    }

    unselectAllHeaders() {
        this.colHeader.forEach(c => (c.selected = false))
    }
}
