import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PopupAnimationService } from "../../../../../animations/popup-animation.service";

import { TooltipComponent } from "./tooltip.component";

@Component({
    template: `
        <button #target>Tooltip Anchor</button>,
        <mona-tooltip [target]="target"></mona-tooltip>
    `,
    standalone: true,
    imports: [TooltipComponent]
})
class TooltipComponentTestComponent {}

describe("TooltipComponent", () => {
    let component: TooltipComponentTestComponent;
    let fixture: ComponentFixture<TooltipComponentTestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TooltipComponent, TooltipComponentTestComponent, BrowserAnimationsModule],
            providers: [PopupAnimationService]
        });
        fixture = TestBed.createComponent(TooltipComponentTestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
