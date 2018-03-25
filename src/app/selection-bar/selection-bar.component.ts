import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HighlightState } from '../shared/';

const CATEGORIES = [
  'alkali',
  'alkaline',
  'lant',
  'actinoid',
  'transition',
  'postTransition',
  'metalloid',
  'nonMetal',
  'nobleGas'
];

@Component({
  selector: 'app-selection-bar',
  templateUrl: './selection-bar.component.html',
  styleUrls: ['./selection-bar.component.scss']
})
export class SelectionBarComponent implements OnInit {

  @Output()
  highlightElement: EventEmitter<HighlightState> = new EventEmitter<HighlightState>();
  @Output()
  selectAllMetals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  selectAllNonmetals: EventEmitter<boolean> = new EventEmitter<boolean>();

  highlightState: HighlightState;
  grayButtonStyle: any = null;

  constructor() { }

  ngOnInit() {
    this.resetHighlight();
    this.resetGrayButtons();
  }

  resetHighlight() {
    this.highlightState = {
      alkali: false,
      alkaline: false,
      lant: false,
      actinoid: false,
      transition: false,
      postTransition: false,
      metalloid: false,
      nonMetal: false,
      nobleGas: false
    };
  }

  resetGrayButtons() {
    this.grayButtonStyle = CATEGORIES.reduce((acc, c) => {
      acc[c] = false;
      return acc;
    }, {});
  }

  changeHighlightState(key: string, value: boolean) {
    this.resetHighlight();
    this.highlightState[key] = value;
    this.highlightElement.emit(this.highlightState);

    const hasTrueValue = Object.keys(this.highlightState).some(k => this.highlightState[k] === true);
    if (hasTrueValue === true) {
      this.grayButtonStyle = CATEGORIES.reduce((acc, c) => {
        acc[c] = this.highlightState[c] !== true;
        return acc;
      }, {});
    } else {
      this.resetGrayButtons();
    }
  }
}
