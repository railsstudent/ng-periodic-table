import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RowSelectorsComponent } from './row-selectors.component'

describe('RowSelectorsComponent', () => {
    let component: RowSelectorsComponent
    let fixture: ComponentFixture<RowSelectorsComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RowSelectorsComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(RowSelectorsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
