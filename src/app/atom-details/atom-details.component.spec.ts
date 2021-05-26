import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AtomDetailsComponent } from './atom-details.component';

describe('AtomDetailsComponent', () => {
    let component: AtomDetailsComponent;
    let fixture: ComponentFixture<AtomDetailsComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [AtomDetailsComponent],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(AtomDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
