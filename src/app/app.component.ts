import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HighlightState } from './shared/';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    highlightState: HighlightState;
    category: string;

    constructor(titleService: Title) {
        titleService.setTitle('Periodic Table');
    }

    highlightElement(highlightState: HighlightState) {
        this.highlightState = highlightState;
    }

    setCurrentAtomCategory(category: string) {
        this.category = category;
    }
}
