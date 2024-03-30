import { Component, TemplateRef, viewChild, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PopupSettingsInjectionToken } from "../../models/PopupInjectionToken";
import { PopupSettings } from "../../models/PopupSettings";

import { PopupWrapperComponent } from "./popup-wrapper.component";

@Component({
    template: `
        <ng-template #contentTemplate>
            <div>Test</div>
        </ng-template>
        <div>Test</div>
    `
})
class PopupWrapperComponentTestComponent {
    public contentTemplate = viewChild.required<TemplateRef<any>>("contentTemplate");
}

const POPUP_TOKEN = [
    {
        provide: PopupSettingsInjectionToken,
        useValue: {} as PopupSettings
    }
];

describe("PopupWrapperComponent", () => {
    let component: PopupWrapperComponent;
    let fixture: ComponentFixture<PopupWrapperComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [PopupWrapperComponent],
            providers: [POPUP_TOKEN]
        });
        fixture = TestBed.createComponent(PopupWrapperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
