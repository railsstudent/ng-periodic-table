import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { environment } from './../../environments/environment';

@Component({
    selector: 'app-footer',
    template: `
        <div class="container">
            <div class="description">
                <p>Made by Connie Leung @{{ currentYear }}. Powered by Angular {{ frameworkVersion }}</p>
                <p>Version: {{ version }}</p>
            </div>
            <div class="source-code">
                <fa-icon
                    [icon]="['fab', 'github']"
                    size="2x"
                    (click)="openExternalLocation(githubUrl)"
                    [attr.aria-label]="'github source code'"
                ></fa-icon>
                <fa-icon
                    [icon]="['fab', 'angular']"
                    size="2x"
                    (click)="openExternalLocation(angularUrl)"
                    [attr.aria-label]="'angular.io'"
                ></fa-icon>
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
                padding: 1em;
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

            fa-icon:not(:last-of-type) {
                margin-right: 1em;
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

    @Input()
    frameworkVersion: string;

    githubUrl = environment.githubUrl;
    angularUrl = environment.angularUrl;

    openExternalLocation(link: string) {
        if (window) {
            window.open(link, '_blank');
        }
    }
}
