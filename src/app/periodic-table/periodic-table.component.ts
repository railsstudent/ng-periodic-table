import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { assign, get } from 'lodash-es';
import { combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, map, shareReplay, startWith, takeUntil } from 'rxjs/operators';
import { Atom } from '../shared';
import { PeriodTableService } from './periodic-table.service';

const MAX_ROW_INDEX = 7;
const MAX_COL_INDEX = 18;
const DESCRIPTION = {
    number: 'Atomic',
    symbol: 'SYM',
    name: 'Name',
    atomic_mass: 'Weight',
};
const LANT_ATOM_GROUP = {
    number: '57-71',
    category: 'lanthanide',
    symbol: '',
    name: '',
    atomic_mass: null,
};
const ACT_ATOM_GROUP = {
    number: '89-103',
    category: 'actinide',
    symbol: '',
    name: '',
    atomic_mass: null,
};
// in milliseconds
const STAY_AT_LEAST = 25;

interface HeaderInfo {
    rowNum: number;
    colNum: number;
    inside: boolean;
}

@Component({
    selector: 'app-periodic-table',
    templateUrl: './periodic-table.component.html',
    styleUrls: ['./periodic-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeriodicTableComponent implements OnInit, OnDestroy {
    description = DESCRIPTION;
    lantAtomGroup = LANT_ATOM_GROUP;
    actinideAtomGroup = ACT_ATOM_GROUP;

    colHeader: { index: number; description: string; selected: boolean }[];
    rowHeader: { index: number; className: string; selected: boolean }[];
    unsubscribe$ = new Subject<void>();
    headerSub$ = new Subject<HeaderInfo>();
    headerMove$: Observable<HeaderInfo>;
    atoms$: Observable<Atom[]>;

    currentAtom: Atom;
    currentRowHeader: number;
    currentColHeader: number;

    wikiAtomName = '';

    constructor(private service: PeriodTableService, private http: HttpClient) {
        this.colHeader = Array(MAX_COL_INDEX)
            .fill(1)
            .map((v, i) => ({
                index: i + 1,
                description: i === 14 ? 'Pnictogens' : i === 15 ? 'Chalcogens' : i === 16 ? 'Halogens' : '',
                selected: false,
            }));

        this.rowHeader = [
            { index: 1, className: 'one', selected: false },
            { index: 2, className: 'two', selected: false },
            { index: 3, className: 'three', selected: false },
            { index: 4, className: 'four', selected: false },
            { index: 5, className: 'fifth', selected: false },
            { index: 6, className: 'six', selected: false },
            { index: 7, className: 'seven', selected: false },
        ];

        this.currentAtom = null;
        this.currentRowHeader = null;
        this.currentColHeader = null;
    }

    ngOnInit() {
        this.headerMove$ = this.headerSub$.pipe(
            startWith({
                rowNum: -1,
                colNum: -1,
                inside: false,
            }),
            debounceTime(STAY_AT_LEAST)
        );

        const cachedAtoms$ = this.http
            .get<Atom[]>('./assets/periodic-table.json')
            .pipe(shareReplay({ bufferSize: 1, refCount: true }));

        this.atoms$ = combineLatest([this.headerMove$, cachedAtoms$]).pipe(
            map(([headerMove, atoms]) => {
                const { rowNum, colNum, inside } = headerMove;
                if (rowNum >= 1) {
                    return atoms.map(atom =>
                        rowNum === atom.ypos || (rowNum === 6 && atom.ypos === 8) || (rowNum === 7 && atom.ypos === 9)
                            ? atom
                            : assign({}, atom, { blurry: inside })
                    );
                } else if (colNum >= 1) {
                    return atoms.map(atom =>
                        colNum === atom.xpos && atom.ypos !== 8 && atom.ypos !== 9
                            ? atom
                            : assign({}, atom, { blurry: inside })
                    );
                }
                return atoms;
            }),
            takeUntil(this.unsubscribe$)
        );
    }

    updateRowHeaderSelected(rowNum: number, inside: boolean) {
        console.log('row number', rowNum, inside);
        this.unselectAllHeaders();
        this.currentRowHeader = inside ? rowNum : null;
        this.rowHeader[rowNum - 1].selected = inside;
        this.headerSub$.next({ rowNum, colNum: -1, inside });
    }

    updateColHeaderSelected(colNum: number, inside: boolean) {
        this.unselectAllHeaders();
        this.currentColHeader = inside ? colNum : null;
        this.colHeader[colNum - 1].selected = inside;
        this.headerSub$.next({ rowNum: -1, colNum, inside });
    }

    unselectAllHeaders() {
        this.rowHeader.forEach(r => (r.selected = false));
        this.colHeader.forEach(c => (c.selected = false));
    }

    showAtomDetails(atom: Atom) {
        this.rowHeader.forEach((r, index) => {
            if (r && r.selected && (!this.currentRowHeader || index !== this.currentRowHeader - 1)) {
                r.selected = false;
            }
        });
        this.colHeader.forEach((c, index) => {
            if (c && c.selected && (!this.currentColHeader || index !== this.currentColHeader - 1)) {
                c.selected = false;
            }
        });
        if (atom) {
            this.currentAtom = atom;
            const { xpos, ypos } = this.currentAtom;
            if (ypos > MAX_ROW_INDEX) {
                this.rowHeader[ypos - 2 - 1].selected = true;
            } else {
                this.rowHeader[ypos - 1].selected = true;
                this.colHeader[xpos - 1].selected = true;
            }
            this.service.changeCurrentAtomCategory(get(this.currentAtom, 'category', ''));
        }
    }

    open(atomName) {
        this.wikiAtomName = atomName;
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
