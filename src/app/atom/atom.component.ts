import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-atom',
  templateUrl: './atom.component.html',
  styleUrls: ['./atom.component.scss']
})
export class AtomComponent implements OnInit, OnChanges {

  @Input()
  data: any;

  @Input()
  solidSelected: boolean;

  @Input()
  liquidSelected: boolean;

  @Input()
  gasSelected: boolean;

  @Input()
  unknownSelected: boolean;

  phaseClass: {}
  backgroundStyles = {
    blurry: false,
    "solid-selected": false,
    "liquid-selected": false,
    "gas-selected": false,
    "unknown-selected": false
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
      const blurry = changes.data && changes.data.currentValue && changes.data.currentValue.blurry || false;
      this.backgroundStyles.blurry = blurry;

      const solid = changes.solidSelected && changes.solidSelected.currentValue && changes.solidSelected.currentValue || false;
      const liquid = changes.liquidSelected && changes.liquidSelected.currentValue && changes.liquidSelected.currentValue || false;
      const gas = changes.gasSelected && changes.gasSelected.currentValue && changes.gasSelected.currentValue || false;
      const unknown = changes.unknownSelected && changes.unknownSelected.currentValue && changes.unknownSelected.currentValue || false;
      this.backgroundStyles['solid-selected'] = solid && this.data.phase === 'solid';
      this.backgroundStyles['liquid-selected'] = liquid && this.data.phase === 'liquid';
      this.backgroundStyles['gas-selected'] = gas && this.data.phase === 'gas';
      this.backgroundStyles['unknown-selected'] = unknown && this.data.phase === 'unknown';
      this.phaseClass = {
        gas: !gas && this.data.phase === 'gas',
        solid: !solid && this.data.phase === 'solid',
        unknown: !unknown && this.data.phase === 'unknown',
        liquid: !liquid && this.data.phase === 'liquid'
      }

  }
}
