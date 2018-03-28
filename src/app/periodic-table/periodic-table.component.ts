import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Atom, HighlightState } from '../shared';
import  { get, assign } from 'lodash-es';

declare function require(url: string);
const atomData = require('../../assets/periodic-table.json');
const MAX_ROW_INDEX = 7;
const MAX_COL_INDEX = 18;
const DESCRIPTION = {
  number: 'Atomic',
  symbol: 'SYM',
  name: 'Name',
  atomic_mass: 'Weight'
};
const LANT_ATOM_GROUP = {
  number: '57-71',
  category: 'lanthanide',
  symbol: '',
  name: '',
  atomic_mass: null
}
const ACT_ATOM_GROUP =  {
  number: '89-103',
  category: 'actinide',
  symbol: '',
  name: '',
  atomic_mass: null
}

@Component({
  selector: 'app-periodic-table',
  templateUrl: './periodic-table.component.html',
  styleUrls: ['./periodic-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeriodicTableComponent implements OnInit, OnChanges {

  @Input()
  selectedMetal: any;
  @Input()
  selectAllMetals: boolean;
  @Input()
  selectAllNonmetals: boolean;

  @Output()
  currentAtomCategory: EventEmitter<string> = new EventEmitter<string>();

  description = DESCRIPTION;
  lantAtomGroup = LANT_ATOM_GROUP;
  actinideAtomGroup = ACT_ATOM_GROUP;

  colHeader: { index: number, description: string, selected: boolean }[];
  atoms: Atom[];
  rowHeader: { index: number, className: string, selected: boolean }[];
  matterClass: { solid: boolean, liquid: boolean, gas: boolean, unknown: boolean };
  metalClass: HighlightState;
  allMetals: boolean;
  allNonmetals: boolean;
  atomDetails: boolean;
  currentAtom: any;

  constructor() {
    this.colHeader = Array(MAX_COL_INDEX).fill(1).map((v, i) => ({
      index: i+1,
      description: i === 14 ? 'Pnictogens':  (i === 15? 'Chalcogens' : (i === 16 ? 'Halogens': '')),
      selected: false
    }));

    this.rowHeader = [
      { index: 1, className: 'one', selected: false },
      { index: 2, className: 'two', selected: false },
      { index: 3, className: 'three', selected: false },
      { index: 4, className: 'four', selected: false },
      { index: 5, className: 'fifth', selected: false },
      { index: 6, className: 'six', selected: false },
      { index: 7, className: 'seven', selected: false }
    ];

    this.atoms = atomData.map(a => ({
      number: a.number,
      symbol: a.symbol,
      name: a.name,
      atomic_mass: a.atomic_mass,
      phase: a.phase,
      category: a.category,
      xpos: a.xpos,
      ypos: a.ypos,
      blurry: false,
      shells: a.shells
    }));

    this.matterClass = {
      solid: false,
      liquid: false,
      gas: false,
      unknown: false
    };

    this.allMetals = false;
    this.allNonmetals = false;
    this.atomDetails = false;
    this.currentAtom = null;
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const { selectedMetal = null, selectAllMetals = null, selectAllNonmetals = null } = changes;
    this.metalClass = get(selectedMetal, 'currentValue', null);
    this.allMetals = get(selectAllMetals, 'currentValue', false);
    this.allNonmetals = get(selectAllNonmetals, 'currentValue', false);
  }

  blurRowAtoms({ rowNum, blurry }) {
    this.atoms = this.atoms.map (atom =>
      (rowNum === atom.ypos || (rowNum === 6 && atom.ypos === 8) || (rowNum === 7 && atom.ypos === 9)) ?
          atom : assign({}, atom, { blurry })
    );
  }

  blurColAtoms({ colNum, blurry }) {
    this.atoms = this.atoms.map (atom =>
      (colNum === atom.xpos && atom.ypos !== 8 && atom.ypos !== 9) ? atom : assign({}, atom, { blurry }));
  }

  updateRowHeaderSelected(rowNum: number, selected: boolean) {
    this.rowHeader[rowNum-1].selected = selected;
    this.blurRowAtoms({ rowNum, blurry: selected })
  }

  updateColHeaderSelected(colNum: number, selected: boolean) {
    this.colHeader[colNum-1].selected=selected;
    this.blurColAtoms({ colNum, blurry: selected })
  }

  showAtomDetails(atomNumber: number) {
    this.atomDetails = (atomNumber !== null && typeof atomNumber !== 'undefined');
    if (atomNumber) {
      this.currentAtom = this.atoms.find(a => a.number === atomNumber);

      const { xpos, ypos } = this.currentAtom;
      if (ypos > MAX_ROW_INDEX) {
        this.rowHeader[ypos - 2 - 1].selected = true;
        // this.prevRow = ypos - 2 - 1;
        // this.prevCol = null;
      } else {
        this.rowHeader[ypos-1].selected = true;
        this.colHeader[xpos-1].selected = true;
        // this.prevRow = ypos - 1;
        // this.prevCol = xpos - 1;
      }
      this.currentAtomCategory.emit(get(this.currentAtom, 'category', null));
    } else {
      const { xpos, ypos } = this.currentAtom;
      if (ypos > MAX_ROW_INDEX) {
        this.rowHeader[ypos - 2 - 1].selected = false;
      } else {
        this.rowHeader[ypos-1].selected = false;
        this.colHeader[xpos-1].selected = false;
      }
    }
  }
}
