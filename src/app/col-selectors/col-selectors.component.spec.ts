import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ColSelectorsComponent } from './col-selectors.component'

describe('ColSelectorsComponent', () => {
    let component: ColSelectorsComponent
    let fixture: ComponentFixture<ColSelectorsComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ColSelectorsComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(ColSelectorsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
