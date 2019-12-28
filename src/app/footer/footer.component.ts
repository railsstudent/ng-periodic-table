import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
// import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
// import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { environment } from './../../environments/environment';

@Component({
    selector: 'app-footer',
    template: `
        <div class="container">
            <div class="description">
                <p>Made by Connie Leung @{{ currentYear }}. Powered by Angular 8</p>
                <p>Version: {{ version }}</p>
            </div>
            <div class="source-code">
                <fa-icon [icon]="['fab', 'github']" size="2x" (click)="openSourceCodeTab()"></fa-icon>
            </div>
        </div>
    `,
    styles: [
        `
            :host {
                display: block;
                width: 100%;
            }

            div.container {
                padding: 1rem;
                background: #4c4c4c;
                color: #fff;

                display: grid;
                grid-template-rows: auto;
                grid-template-columns: 1fr 2fr 1fr;
            }

            div.description {
                grid-row: 1;
                grid-column: 2 / 3;

                text-align: center;
            }

            div.source-code {
                grid-row: 1;
                grid-column: 3 / -1;

                justify-self: end;
            }

            p {
                font-size: 1em;
                line-height: 120%;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
    @Input()
    version: string;

    @Input()
    currentYear: number;

    url = environment.githubUrl;

    // constructor(private library: FaIconLibrary) {
    //   this.library.addIcons(faGithub);
    // }

    openSourceCodeTab() {
        if (window) {
            window.open(environment.githubUrl, '_blank');
        }
    }
}
