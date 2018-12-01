import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HighlightState } from './shared/';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    // title = "app";
    highlightState: HighlightState;
    selectAllMetals: boolean;
    selectAllNonmetals: boolean;
    category: string;

    highlightElement(highlightState: HighlightState) {
        this.highlightState = highlightState;
    }
    constructor(titleService: Title) {
        titleService.setTitle('Periodic Table');
    }

    highlightElement(highlightState: HighlightState) {
        this.highlightState = highlightState;
    }

    selectMetalCat(select: boolean) {
        this.selectAllMetals = select;
    }

    selectNonmetalCat(select: boolean) {
        this.selectAllNonmetals = select;
    }

    setCurrentAtomCategory(category: string) {
        this.category = category;
    }
}
