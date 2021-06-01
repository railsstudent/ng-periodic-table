import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Atom } from '../constant';

@Component({
    selector: 'app-atom-details',
    templateUrl: './atom-details.component.html',
    styleUrls: ['./atom-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomDetailsComponent {
    @Input()
    data: Atom | null = null;
}
