import { Component, OnInit } from '@angular/core';
import { Atom } from '../shared';

declare function require(url: string);
const atomData = require('../../assets/periodic-table.json');

@Component({
  selector: 'app-periodic-table',
  templateUrl: './periodic-table.component.html',
  styleUrls: ['./periodic-table.component.scss']
})
export class PeriodicTableComponent implements OnInit {

  colHeader: { index: number, description: string }[];
  atoms: Atom[];
  rowHeader: any;

  description = {
    number: 'Atomic',
    symbol: 'SYM',
    name: 'Name',
    atomic_mass: 'Weight'
  };

  lantAtomGroup = {
    number: '57-71',
    category: 'lanthanide',
    symbol: '',
    name: '',
    atomic_mass: null
  }

  actinideAtomGroup = {
    number: '89-103',
    category: 'actinide',
    symbol: '',
    name: '',
    atomic_mass: null
  }

  matterClass = {
    solid: false,
    liquid: false,
    gas: false,
    unknown: false
  };

  constructor() { }

  ngOnInit() {
    this.colHeader = Array(18).fill(1).map((v, i) => ({
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
      blurry: false
    }));
  }

  blurRowAtoms({ rowNum, blurry }) {
    this.atoms = this.atoms.map (atom =>
      (rowNum === atom.ypos || (rowNum === 6 && atom.ypos === 9) || (rowNum === 7 && atom.ypos === 10)) ?
          atom : Object.assign({}, atom, { blurry })
    );
  }

  blurColAtoms({ colNum, blurry }) {
    this.atoms = this.atoms.map (atom =>
      (colNum === atom.xpos && atom.ypos !== 9 && atom.ypos !== 10) ? atom : Object.assign({}, atom, { blurry }));
  }

  selectSolid() {
    console.log('select all solid');
  }

  selectLiquid() {
    console.log('select all liquid');
  }

  selectGas() {
    console.log('select all gas');
  }

  selectUnknown() {
    console.log('select all unknown');
  }
}
