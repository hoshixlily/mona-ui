import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RangeSliderComponent } from "./range-slider.component";

describe("RangeSlider2Component", () => {
    let component: RangeSliderComponent;
    let fixture: ComponentFixture<RangeSliderComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [RangeSliderComponent]
        });
        fixture = TestBed.createComponent(RangeSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
