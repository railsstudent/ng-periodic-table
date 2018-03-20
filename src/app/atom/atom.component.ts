import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-atom',
  templateUrl: './atom.component.html',
  styleUrls: ['./atom.component.scss']
})
export class AtomComponent implements OnInit, OnChanges {

  @Input()
  data: any;

  phaseClass: {}
  backgroundStyles = {
    blurry: false
  };

  constructor() { }

  ngOnInit() {
    this.phaseClass = {
      gas: this.data.phase === 'gas',
      solid: this.data.phase === 'solid',
      unknown: this.data.phase === 'unknown',
      liquid: this.data.phase === 'liquid'
    }
  }

  ngOnChanges(changes: SimpleChanges) {
      console.log(changes)
      const blurry = changes.data && changes.data.currentValue && changes.data.currentValue.blurry || false;
      this.backgroundStyles.blurry = blurry;
  }
}
