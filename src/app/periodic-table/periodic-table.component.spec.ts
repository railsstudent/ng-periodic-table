import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PeriodicTableComponent } from './periodic-table.component';

describe('PeriodicTableComponent', () => {
    let component: PeriodicTableComponent;
    let fixture: ComponentFixture<PeriodicTableComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [PeriodicTableComponent],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(PeriodicTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
