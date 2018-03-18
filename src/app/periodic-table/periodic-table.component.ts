import { Component, OnInit } from '@angular/core';
import { Atom } from '../shared';

declare function require(url: string);
const atomData = require('../../assets/periodic-table.json');

// import * as atomData from '../../assets/periodic-table.json'


@Component({
  selector: 'app-periodic-table',
  templateUrl: './periodic-table.component.html',
  styleUrls: ['./periodic-table.component.scss']
})
export class PeriodicTableComponent implements OnInit {

  rowHeader: { index: number, description: string }[];
  atoms: Atom[];
  description = {
    number: 'Atomic',
    symbol: 'SYM',
    name: 'Name',
    atomic_mass: 'Weight',
    phase: '',
    category: '',
    xpos: 3,
    ypos: 2
  }

  constructor() { }

  ngOnInit() {
    this.rowHeader = Array(18).fill(1).map((v, i) => ({
      index: i+1,
      description: i === 14 ? 'Pnictogens':  (i === 15? 'Chalcogens' : (i === 16 ? 'Halogens': ''))
    }));

    this.atoms = atomData.map(a => ({
      number: a.number,
      symbol: a.symbol,
      name: a.name,
      atomic_mass: a.atomic_mass,
      phase: a.phase,
      category: a.category,
      xpos: a.xpos + 1,
      ypos: a.ypos + 1
    })).concat([{
      number: '57-71',
      category: 'lanthanide',
      symbol: '',
      name: '',
      atomic_mass: null,
      phase: '',
      xpos: 7,
      ypos: 4
    }, {
      number: '89-103',
      category: 'actinide',
      symbol: '',
      name: '',
      atomic_mass: null,
      phase: '',
      xpos: 8,
      ypos: 4
    }]);
  }
}
