import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HighlightState } from '../shared/highlight-state';

@Component({
  selector: 'app-selection-bar',
  templateUrl: './selection-bar.component.html',
  styleUrls: ['./selection-bar.component.scss']
})
export class SelectionBarComponent implements OnInit {

  highlightState: HighlightState;
  @Output()
  highlightElement: EventEmitter<HighlightState> = new EventEmitter<HighlightState>();

  constructor() { }

  ngOnInit() {
    this.resetHighlight();
  }

  resetHighlight() {
    this.highlightState = {
      alkali: false,
      alkaline: false,
      lant: false,
      actinoids: false,
      transition: false,
      postTransition: false,
      metalloids: false,
      nonMetals: false,
      nobleGas: false
    };
  }

  changeHighlightState(key: string, value: boolean) {
    this.resetHighlight();
    this.highlightState[key] = value;
    this.highlightElement.emit(this.highlightState);
  }
}
