import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectionBarComponent } from './selection-bar.component';

describe('SelectionBarComponent', () => {
    let component: SelectionBarComponent;
    let fixture: ComponentFixture<SelectionBarComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [SelectionBarComponent],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectionBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
