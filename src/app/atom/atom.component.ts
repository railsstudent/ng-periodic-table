import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HighlightState } from '../shared';
import * as get from 'lodash/get';
import * as includes from 'lodash/includes';

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

  @Input()
  metalSelected: HighlightState;

  @Input()
  selectAllMetals: boolean

  @Input()
  selectAllNonmetals: boolean;

  phaseClass: {}
  backgroundStyles = {
    blurry: false,
    "solid-selected": false,
    "liquid-selected": false,
    "gas-selected": false,
    "unknown-selected": false,
    grayout: false
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
      const { data = null,
        solidSelected = null,
        liquidSelected = null,
        gasSelected = null,
        unknownSelected = null,
        metalSelected = null,
        selectAllMetals = null,
        selectAllNonmetals = null } = changes;

      const blurry = get(data, 'currentValue.blurry', false);
      const solid = get(solidSelected, 'currentValue', false);
      const liquid = get(liquidSelected, 'currentValue', false);
      const gas = get(gasSelected, 'currentValue', false);
      const unknown = get(unknownSelected, 'currentValue', false);
      const alkali = get(metalSelected, 'currentValue.alkali', false);
      const alkaline = get(metalSelected, 'currentValue.alkaline', false);
      const lant = get(metalSelected, 'currentValue.lant', false);
      const actinoid = get(metalSelected, 'currentValue.actinoid', false);
      const transition =  get(metalSelected, 'currentValue.transition', false);
      const postTransition = get(metalSelected, 'currentValue.postTransition', false);
      const metalloid = get(metalSelected, 'currentValue.metalloid', false);
      const nonMetal = get(metalSelected, 'currentValue.nonMetal', false);
      const nobleGas = get(metalSelected, 'currentValue.nobleGas', false);
      const allMetals = get(selectAllMetals, 'currentValue', false);
      const allNonMetals = get(selectAllNonmetals, 'currentValue', false);

      this.backgroundStyles.blurry = blurry;
      this.backgroundStyles['solid-selected'] = solid && this.data.phase === 'solid';
      this.backgroundStyles['liquid-selected'] = liquid && this.data.phase === 'liquid';
      this.backgroundStyles['gas-selected'] = gas && this.data.phase === 'gas';
      this.backgroundStyles['unknown-selected'] = unknown && this.data.phase === 'unknown';
      this.backgroundStyles.grayout = alkali && this.data.category !== 'alkali-metal'
        || alkaline && this.data.category !== 'alkaline-earth-metal'
        || lant && this.data.category !== 'lanthanide'
        || actinoid && this.data.category !== 'actinide'
        || transition && this.data.category !== 'transition-metal'
        || postTransition && this.data.category !== 'post-transition-metal'
        || metalloid && this.data.category !== 'metalloid'
        || nonMetal && this.data.category !== 'nonmetal'
        || nobleGas && this.data.category !== 'noble-gas'
        || allMetals && includes(['metalloid', 'nonmetal', 'noble-gas'], this.data.category)
        || allNonMetals && includes(['alkali-metal', 'alkaline-earth-metal',
          'lanthanide', 'actinide', 'transition-metal', 'post-transition-metal', 'metalloid'], this.data.category);

      this.phaseClass = {
        gas: !gas && this.data.phase === 'gas',
        solid: !solid && this.data.phase === 'solid',
        unknown: !unknown && this.data.phase === 'unknown',
        liquid: !liquid && this.data.phase === 'liquid'
      }

  }
}
