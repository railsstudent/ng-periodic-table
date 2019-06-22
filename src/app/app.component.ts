import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    currentYear: number;

    constructor(titleService: Title) {
        titleService.setTitle('Periodic Table');
        this.currentYear = new Date().getFullYear();
    }
}
