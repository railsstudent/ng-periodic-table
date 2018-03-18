import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HighlightState } from './shared/';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  highlightState: HighlightState;

  constructor(titleService: Title) {
    titleService.setTitle('Periodic Table');
  }

  highlightElement(highlightState: HighlightState) {
    //this.highlightState = JSON.stringify(highlightState);
  }
}
