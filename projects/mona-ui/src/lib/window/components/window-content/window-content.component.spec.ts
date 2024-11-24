import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { PopupDataInjectionToken } from "../../../popup/models/PopupInjectionToken";
import { WindowInjectorData } from "../../models/WindowInjectorData";

import { WindowContentComponent } from "./window-content.component";

@Component({
    template: ` <div>Test</div> `,
    standalone: false
})
class WindowContentComponentTestComponent {}

const POPUP_TOKEN = [
    {
        provide: PopupDataInjectionToken,
        useValue: {
            content: WindowContentComponentTestComponent
        } as WindowInjectorData
    }
];

describe("WindowContentComponent", () => {
    let component: WindowContentComponent;
    let fixture: ComponentFixture<WindowContentComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [WindowContentComponent, ButtonDirective, BrowserAnimationsModule],
            providers: [POPUP_TOKEN]
        });
        fixture = TestBed.createComponent(WindowContentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
