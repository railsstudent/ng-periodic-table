import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HighlightState } from '../shared/';
import * as some from 'lodash/some';

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
  highlightState: HighlightState;
  grayButtonStyle = {};

  constructor() { }

  ngOnInit() {
    this.resetHighlight();
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

  changeHighlightState(key: string, value: boolean) {
    this.resetHighlight();
    this.highlightState[key] = value;
    this.highlightElement.emit(this.highlightState);

    const hasTrueValue = Object.keys(this.highlightState).some(k => this.highlightState[k] === true);
    if (hasTrueValue === true) {
      this.grayButtonStyle = CATEGORIES.reduce((acc, k) => {
                                  acc[k] = this.highlightState[k] !== true;
                                  return acc;
                              }, {})
    } else {
      this.grayButtonStyle = CATEGORIES.reduce((acc, k) => {
                                acc[k] = false;
                                return acc;
                              }, {});
    }
    console.log(this.grayButtonStyle);
  }
}
