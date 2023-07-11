import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SliderComponent } from "./slider.component";

describe("Slider2Component", () => {
    let component: SliderComponent;
    let fixture: ComponentFixture<SliderComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SliderComponent]
        });
        fixture = TestBed.createComponent(SliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
