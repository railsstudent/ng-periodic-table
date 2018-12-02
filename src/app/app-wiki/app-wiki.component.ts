import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnInit,
    Renderer2,
    ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

const BASE_URL = 'https://en.wikipedia.org/wiki';

@Component({
    selector: 'app-wiki',
    template: `
        <div class="modal-content">
            <iframe [src]="url" #iframe></iframe>
            <div class="loader" #loader><p class="text">Loading Content...</p></div>
        </div>
    `,
    styles: [
        `
            :host {
                position: fixed;
                left: 0;
                top: 0;
                bottom: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.4);
                z-index: 1000;
            }

            .modal-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 80%;
                height: 80%;
            }

            iframe {
                opacity: 0;
                width: 0;
                height: 0;
                border: 0;
            }

            .loader {
                position: absolute;
                opacity: 1;
                width: 100%;
                height: 100%;
                background: #fff;

                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 2em;
                color: blue;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppWikiComponent implements OnInit, AfterViewInit {
    @Input()
    atomName: string;

    @ViewChild('iframe')
    iframe: ElementRef<HTMLIFrameElement>;

    @ViewChild('loader')
    loader: ElementRef<HTMLDivElement>;

    url: SafeUrl;

    constructor(private santiizer: DomSanitizer, private renderer: Renderer2) {}

    ngOnInit() {
        this.url = this.santiizer.bypassSecurityTrustResourceUrl(`${BASE_URL}/${this.atomName}`);
    }

    ngAfterViewInit() {
        const el = this.iframe.nativeElement;
        el.onload = () => {
            this.renderer.setStyle(this.loader.nativeElement, 'opacity', '0');
            this.renderer.setStyle(this.loader.nativeElement, 'width', '0');
            this.renderer.setStyle(this.loader.nativeElement, 'height', '0');
            this.renderer.setStyle(el, 'opacity', '1');
            this.renderer.setStyle(el, 'width', '100%');
            this.renderer.setStyle(el, 'height', '100%');
        };
    }
}
