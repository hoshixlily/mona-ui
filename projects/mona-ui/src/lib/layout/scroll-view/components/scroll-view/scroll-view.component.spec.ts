import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ScrollViewComponent } from "./scroll-view.component";

describe("ScrollViewComponent", () => {
    let component: ScrollViewComponent;
    let fixture: ComponentFixture<ScrollViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ScrollViewComponent]
        });
        fixture = TestBed.createComponent(ScrollViewComponent);
        component = fixture.componentInstance;

        fixture.componentRef.setInput("width", 500);
        fixture.componentRef.setInput("height", 375);

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
