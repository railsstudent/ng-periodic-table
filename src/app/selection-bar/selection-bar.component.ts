import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HighlightState } from '../shared/';

// const CATEGORIES = [
//   'alkali',
//   'alkaline',
//   'lant',
//   'actinoid',
//   'transition',
//   'postTransition',
//   'metalloid',
//   'nonMetal',
//   'nobleGas'
// ];

@Component({
  selector: 'app-selection-bar',
  templateUrl: './selection-bar.component.html',
  styleUrls: ['./selection-bar.component.scss']
})
export class SelectionBarComponent implements OnInit {

  @Output()
  highlightElement: EventEmitter<HighlightState> = new EventEmitter<HighlightState>();
  highlightState: HighlightState;
  grayButtonStyle = {
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
      this.grayButtonStyle = {
        alkali: this.highlightState.alkali !== true,
        alkaline: this.highlightState.alkaline !== true,
        lant: this.highlightState.lant !== true,
        actinoid: this.highlightState.actinoid !== true,
        transition: this.highlightState.transition !== true,
        postTransition: this.highlightState.postTransition !== true,
        metalloid: this.highlightState.metalloid !== true,
        nonMetal: this.highlightState.nonMetal !== true,
        nobleGas: this.highlightState.nobleGas !== true
      };
    } else {
      this.grayButtonStyle = {
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
  }
}
