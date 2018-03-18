import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-periodic-table',
  templateUrl: './periodic-table.component.html',
  styleUrls: ['./periodic-table.component.scss']
})
export class PeriodicTableComponent implements OnInit {

  rowHeader: { index: number, description: string }[];
  atoms: number[];

  constructor() { }

  ngOnInit() {
    this.rowHeader = Array(18).fill(1).map((v, i) => ({
      index: i+1,
      description: i === 14 ? 'Pnictogens':  (i === 15? 'Chalcogens' : (i === 16 ? 'Halogens': ''))
    }));

    this.atoms = Array(36).fill(1).map((v, i) => i+1);
  }
}
