import { Component, TemplateRef, ViewChild } from "@angular/core";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
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
    @ViewChild("contentTemplate")
    public contentTemplate!: TemplateRef<any>;
}

const POPUP_TOKEN = [
    {
        provide: PopupSettingsInjectionToken,
        useValue: {} as PopupSettings
    }
];

describe("PopupWrapperComponent", () => {
    let spectator: Spectator<PopupWrapperComponent>;
    const createComponent = createComponentFactory({
        component: PopupWrapperComponent,
        providers: [POPUP_TOKEN]
    });
    let testComponentSpectator: Spectator<PopupWrapperComponentTestComponent>;
    const createTestComponent = createComponentFactory({
        component: PopupWrapperComponentTestComponent
    });

    beforeEach(() => {
        testComponentSpectator = createTestComponent();
        spectator = createComponent({
            props: {
                templateRef: testComponentSpectator.component.contentTemplate
            }
        });
    });

    it("should create", () => {
        expect(spectator.component).toBeTruthy();
    });
});
