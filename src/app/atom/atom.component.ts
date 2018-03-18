import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-atom',
  templateUrl: './atom.component.html',
  styleUrls: ['./atom.component.scss']
})
export class AtomComponent implements OnInit {

  @Input()
  data: any;
  phaseClass: {}

  constructor() { }

  ngOnInit() {
    this.phaseClass = {
      gas: this.data.phase === 'gas',
      solid: this.data.phase === 'solid',
      unknown: this.data.phase === 'unknown',
      liquid: this.data.phase === 'liquid'
    }
  }

}
