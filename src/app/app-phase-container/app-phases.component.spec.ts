import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPhasesComponent } from './app-phases.component';

describe('AppPhasesComponent', () => {
  let component: AppPhasesComponent;
  let fixture: ComponentFixture<AppPhasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppPhasesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPhasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
