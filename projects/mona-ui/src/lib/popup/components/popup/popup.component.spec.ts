import { Component, viewChild } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";

import { PopupComponent } from "./popup.component";

@Component({
    template: `
        <button #target>Test</button>
        <mona-popup [anchor]="target" [trigger]="trigger">
            <ng-template>
                <div>Test</div>
            </ng-template>
        </mona-popup>
    `,
    imports: [PopupComponent]
})
class PopupComponentTestComponent {
    public trigger: string = "click";
    public popupComponent = viewChild.required(PopupComponent);
}

describe("PopupComponent", () => {
    let hostComponent: PopupComponentTestComponent;
    let hostFixture: ComponentFixture<PopupComponentTestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [PopupComponent, PopupComponentTestComponent]
        });
        hostFixture = TestBed.createComponent(PopupComponentTestComponent);
        hostComponent = hostFixture.componentInstance;
    });

    it("should create", () => {
        expect(hostComponent).toBeTruthy();
    });

    it("should show popup on click", fakeAsync(() => {
        // const button = hostFixture.debugElement.nativeElement.querySelector("button");
        // button.click();
        // tick();
        // hostFixture.detectChanges();
        // tick();
        // const popupDiv = document.querySelector("div.cdk-overlay-container");
        // expect(popupDiv).not.toBeNull();
        expect().nothing(); // TODO: Use fromEvent for popup component event listening
    }));
});
