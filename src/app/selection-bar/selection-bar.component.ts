import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy, Input ,
  OnChanges, SimpleChanges } from '@angular/core';
import { HighlightState } from '../shared/';
import * as get from 'lodash/get';

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
  styleUrls: ['./selection-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectionBarComponent implements OnInit, OnChanges {

  @Output()
  highlightElement: EventEmitter<HighlightState> = new EventEmitter<HighlightState>();
  @Output()
  selectAllMetals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  selectAllNonmetals: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  currentAtomCategory: string;

  highlightState: HighlightState;
  grayButtonStyle: any = null;
  prevAtomCategory: string;

  constructor() {
    this.resetHighlight();
    this.resetGrayButtons();
    this.prevAtomCategory = null;
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const { currentAtomCategory = null } = changes;
    //console.log(currentAtomCategory);
    const currentCategory = get(currentAtomCategory, 'currentValue', null);
    //console.log('currentCategory', currentCategory);
    this.resetHighlight();
    if (currentCategory) {
      let prop = '';
      switch (currentCategory) {
        case 'alkali-metal':
          prop = 'alkali';
          break;
        case 'alkaline-earth-metal':
          prop = 'alkaline';
          break;
        case 'lanthanide' :
          prop = 'lant';
          break;
        case 'actinide':
          prop = 'actinoid';
          break;
        case 'transition-metal':
          prop = 'transition';
          break;
        case 'post-transition-metal':
          prop = 'postTransition';
          break;
        case 'metalloid':
          prop = 'metalloid';
          break;
        case 'nonmetal':
          prop = 'nonMetal';
          break;
        case 'noble-gas':
          prop = 'nobleGas';
          break;
      }
      if (prop) {
        this.highlightState[prop] = true;
      }
    }
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
