import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { StyleAtom } from '../types'

@Component({
    selector: 'app-atom-details',
    templateUrl: './atom-details.component.html',
    styleUrls: ['./atom-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomDetailsComponent {
    @Input()
    data: StyleAtom | null = null
}
