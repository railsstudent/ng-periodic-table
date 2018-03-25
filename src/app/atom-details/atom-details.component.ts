import { Component, OnInit, Input , OnChanges, SimpleChanges } from '@angular/core';
import * as get from 'lodash/get';

@Component({
  selector: 'app-atom-details',
  templateUrl: './atom-details.component.html',
  styleUrls: ['./atom-details.component.scss']
})
export class AtomDetailsComponent implements OnInit, OnChanges {

  @Input()
  data: null;

  phaseClass: {}

  constructor() { }

  ngOnInit() {
    console.log(this.data);
  }

  ngOnChanges(changes: SimpleChanges) {
    const { data = null } = changes;
    console.log(data);
    this.phaseClass = {
      gas: get(data, 'currentValue.phase', '') === 'gas',
      solid: get(data, 'currentValue.phase', '') === 'solid',
      unknown: get(data, 'currentValue.phase', '') === 'unknown',
      liquid: get(data, 'currentValue.phase', '') === 'liquid'
    }
  }
}
