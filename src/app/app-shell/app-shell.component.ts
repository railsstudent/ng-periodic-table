import { Component } from '@angular/core'
import { Title } from '@angular/platform-browser'

@Component({
    selector: 'app-shell',
    template: `
        <div class="container">
            <app-selection-bar></app-selection-bar>
            <app-periodic-table></app-periodic-table>
            <app-footer
                [version]="version"
                [currentYear]="currentYear"
                [frameworkVersion]="frameworkVersion"
            ></app-footer>
        </div>
    `,
    styles: [
        `
            .container {
                display: flex;
                flex-direction: column;
                min-height: 100vh;
            }

            app-footer {
                margin-top: 0.625rem;
            }
        `,
    ],
})
export class AppShellComponent {
    currentYear = new Date().getFullYear()
    version = '0.1.0'
    frameworkVersion = '12.0.1'

    constructor(titleService: Title) {
        titleService.setTitle('Periodic Table')
    }
}
