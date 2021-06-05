import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-phases',
    templateUrl: './app-phases.component.html',
    styleUrls: ['./app-phases.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppPhasesComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
