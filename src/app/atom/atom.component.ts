import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnDestroy,
  DoCheck,
  KeyValueDiffers,
  ChangeDetectorRef
} from "@angular/core";
import { HighlightState, MatterType } from "../shared";
import { get, includes } from "lodash-es";
import { Subject, Subscription } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";

// in milliseconds
const STAY_AT_LEAST = 250;

@Component({
  selector: "app-atom",
  templateUrl: "./atom.component.html",
  styleUrls: ["./atom.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AtomComponent implements OnInit, OnChanges, OnDestroy, DoCheck {
  @Input()
  data: any;

  @Input()
  matterSelected: MatterType;

  @Input()
  metalSelected: HighlightState;

  @Input()
  selectAllMetals: boolean;

  @Input()
  selectAllNonmetals: boolean;

  @Output()
  hoverAtom: EventEmitter<number> = new EventEmitter<number>();

  phaseClass: any = {};
  backgroundStyles: any = {};

  mouseEnterSubject = new Subject<number>();
  mouseLeaveSubject = new Subject<number>();
  // mouseEnterSubscription: Subscription;
  // mouseLeaveSubscription: Subscription;
  differ: any;
  private unsubscribe$ = new Subject<void>();

  constructor(private differs: KeyValueDiffers, private cd: ChangeDetectorRef) {
    this.backgroundStyles = {
      blurry: false,
      "solid-selected": false,
      "liquid-selected": false,
      "gas-selected": false,
      "unknown-selected": false,
      grayout: false
    };

    this.differ = this.differs.find({}).create();
  }

  ngOnInit() {
    this.phaseClass = {
      gas: this.data.phase === "gas",
      solid: this.data.phase === "solid",
      unknown: this.data.phase === "unknown",
      liquid: this.data.phase === "liquid"
    };

    this.mouseEnterSubject
      .pipe(
        debounceTime(STAY_AT_LEAST),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        (value: number) => {
          this.hoverAtom.emit(value);
          console.log(`debounce mouseEnter, ${value}`);
        },
        err => console.error(err)
      );

    this.mouseLeaveSubject
      .pipe(
        debounceTime(STAY_AT_LEAST),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        (value: number) => {
          this.hoverAtom.emit(null);
          console.log(`debounce mouseleave, ${value}`);
        },
        err => console.error(err)
      );
  }

  ngDoCheck() {
    const changes = this.differ.diff(this.matterSelected);
    if (changes) {
      changes.forEachChangedItem(c => {
        if (c.key === "solid") {
          this.backgroundStyles["solid-selected"] =
            c.currentValue && this.data.phase === "solid";
          this.phaseClass.solid =
            this.data.phase === "solid" && !c.currentValue;
        } else if (c.key === "gas") {
          this.backgroundStyles["gas-selected"] =
            c.currentValue && this.data.phase === "gas";
          this.phaseClass.gas = this.data.phase === "gas" && !c.currentValue;
        } else if (c.key === "liquid") {
          this.backgroundStyles["liquid-selected"] =
            c.currentValue && this.data.phase === "liquid";
          this.phaseClass.liquid =
            this.data.phase === "liquid" && !c.currentValue;
        } else if (c.key === "unknown") {
          this.backgroundStyles["unknown-selected"] =
            c.currentValue && this.data.phase === "unknown";
          this.phaseClass.unknown =
            this.data.phase === "unknown" && !c.currentValue;
        }
      });
      this.cd.markForCheck();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const {
      data = null,
      metalSelected = null,
      selectAllMetals = null,
      selectAllNonmetals = null
    } = changes;

    const blurry = get(data, "currentValue.blurry", false);
    const alkali = get(metalSelected, "currentValue.alkali", false);
    const alkaline = get(metalSelected, "currentValue.alkaline", false);
    const lant = get(metalSelected, "currentValue.lant", false);
    const actinoid = get(metalSelected, "currentValue.actinoid", false);
    const transition = get(metalSelected, "currentValue.transition", false);
    const postTransition = get(
      metalSelected,
      "currentValue.postTransition",
      false
    );
    const metalloid = get(metalSelected, "currentValue.metalloid", false);
    const nonMetal = get(metalSelected, "currentValue.nonMetal", false);
    const nobleGas = get(metalSelected, "currentValue.nobleGas", false);
    const allMetals = get(selectAllMetals, "currentValue", false);
    const allNonMetals = get(selectAllNonmetals, "currentValue", false);

    this.backgroundStyles = {
      blurry,
      "solid-selected": false,
      "liquid-selected": false,
      "gas-selected": false,
      "unknown-selected": false,
      grayout:
        (alkali && this.data.category !== "alkali-metal") ||
        (alkaline && this.data.category !== "alkaline-earth-metal") ||
        (lant && this.data.category !== "lanthanide") ||
        (actinoid && this.data.category !== "actinide") ||
        (transition && this.data.category !== "transition-metal") ||
        (postTransition && this.data.category !== "post-transition-metal") ||
        (metalloid && this.data.category !== "metalloid") ||
        (nonMetal && this.data.category !== "nonmetal") ||
        (nobleGas && this.data.category !== "noble-gas") ||
        (allMetals &&
          includes(
            ["metalloid", "nonmetal", "noble-gas"],
            this.data.category
          )) ||
        (allNonMetals &&
          includes(
            [
              "alkali-metal",
              "alkaline-earth-metal",
              "lanthanide",
              "actinide",
              "transition-metal",
              "post-transition-metal",
              "metalloid"
            ],
            this.data.category
          ))
    };
  }

  ngOnDestroy() {
    if (this.unsubscribe$) {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
  }

  debounceMouseEnter() {
    this.mouseEnterSubject.next(this.data.number);
  }

  debounceMouseLeave() {
    this.mouseLeaveSubject.next(this.data.number);
  }
}
