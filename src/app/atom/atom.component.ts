import { Component, OnInit, Input, OnChanges, SimpleChanges, Output,
  EventEmitter, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { HighlightState } from '../shared';
import { get, includes } from 'lodash';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';

// in milliseconds
const STAY_AT_LEAST = 250;

@Component({
  selector: 'app-atom',
  templateUrl: './atom.component.html',
  styleUrls: ['./atom.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AtomComponent implements OnInit, OnChanges, OnDestroy {

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

  @Output()
  hoverAtom: EventEmitter<number> = new EventEmitter<number>();

  phaseClass: any = {};
  backgroundStyles: any = {};

  mouseEnterSubject = new Subject<number>();
  mouseLeaveSubject = new Subject<number>();
  mouseEnterSubscription: Subscription;
  mouseLeaveSubscription: Subscription;

  constructor() {
    this.backgroundStyles = {
      blurry: false,
      "solid-selected": false,
      "liquid-selected": false,
      "gas-selected": false,
      "unknown-selected": false,
      grayout: false
    };
  }

  ngOnInit() {
    this.phaseClass = {
      gas: this.data.phase === 'gas',
      solid: this.data.phase === 'solid',
      unknown: this.data.phase === 'unknown',
      liquid: this.data.phase === 'liquid'
    }

    this.mouseEnterSubscription = this.mouseEnterSubject.debounceTime(STAY_AT_LEAST)
      .subscribe(
        (value: number) => {
          this.hoverAtom.emit(value);
          console.log(`denouce mouseEnter, ${value}`);
        },
        (err) => console.error(err)
      );

      this.mouseLeaveSubscription = this.mouseLeaveSubject.debounceTime(STAY_AT_LEAST)
      .subscribe(
        (value: number) => {
          this.hoverAtom.emit(null);
          console.log(`debounce mouseleave, ${value}`);
        },
        (err) => console.error(err)
      );
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

      this.backgroundStyles = {
        blurry,
        'solid-selected': solid && this.data.phase === 'solid',
        'liquid-selected': liquid && this.data.phase === 'liquid',
        'gas-selected': gas && this.data.phase === 'gas',
        'unknown-selected': unknown && this.data.phase === 'unknown',
         grayout: alkali && this.data.category !== 'alkali-metal'
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
                     'lanthanide', 'actinide', 'transition-metal', 'post-transition-metal', 'metalloid'], this.data.category)
      }

      this.phaseClass = {
        gas: !gas && this.data.phase === 'gas',
        solid: !solid && this.data.phase === 'solid',
        unknown: !unknown && this.data.phase === 'unknown',
        liquid: !liquid && this.data.phase === 'liquid'
      }
  }

  ngOnDestroy() {
    this.mouseEnterSubscription.unsubscribe();
    this.mouseLeaveSubscription.unsubscribe();
  }

  debounceMouseEnter() {
    this.mouseEnterSubject.next(this.data.number);
  }

  debounceMouseLeave() {
    this.mouseLeaveSubject.next(this.data.number);
  }
}
