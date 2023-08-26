import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PopupAnimationService } from "../../animations/services/popup-animation.service";
import { PopoverTrigger } from "../models/PopoverTrigger";

import { PopoverComponent } from "./popover.component";

@Component({
    template: `
        <button #target>Popover Anchor</button>,
        <mona-popover [target]="target" [trigger]="trigger"></mona-popover>
    `,
    standalone: true,
    imports: [PopoverComponent]
})
class PopoverComponentTestComponent {
    public trigger: PopoverTrigger = "click";
}

describe("PopoverComponent", () => {
    let hostComponent: PopoverComponentTestComponent;
    let hostFixture: ComponentFixture<PopoverComponentTestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [PopoverComponent, PopoverComponentTestComponent, BrowserAnimationsModule],
            providers: [PopupAnimationService]
        });
        hostFixture = TestBed.createComponent(PopoverComponentTestComponent);
        hostComponent = hostFixture.componentInstance;
        hostFixture.detectChanges();
    });

    it("should create", () => {
        expect(hostComponent).toBeTruthy();
    });
});
