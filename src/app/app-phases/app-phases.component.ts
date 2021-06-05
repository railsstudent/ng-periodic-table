import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core'
import { Phase } from '../constant'

@Component({
    selector: 'app-phases',
    templateUrl: './app-phases.component.html',
    styleUrls: ['./app-phases.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppPhasesComponent {
    @Output()
    hoverPhase = new EventEmitter<Phase>()

    hoverPhaseHandled(phase: Phase) {
        this.hoverPhase.emit(phase)
    }
}
