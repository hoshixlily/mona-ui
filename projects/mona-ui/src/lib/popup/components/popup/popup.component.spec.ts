import { Component, TemplateRef, ViewChild } from "@angular/core";
import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";

import { PopupComponent } from "./popup.component";

@Component({
    template: `
        <ng-template #contentTemplate>
            <div>Test</div>
        </ng-template>
    `
})
class PopupComponentTestComponent {
    @ViewChild("contentTemplate")
    public contentTemplate!: TemplateRef<any>;
}

describe("PopupComponent", () => {
    let spectator: Spectator<PopupComponent>;
    const createComponent = createComponentFactory({
        component: PopupComponent
    });
    let testComponentSpectator: Spectator<PopupComponentTestComponent>;
    const createTestComponent = createComponentFactory({
        component: PopupComponentTestComponent,
        imports: [FontAwesomeTestingModule]
    });

    beforeEach(() => {
        const target = document.createElement("div");
        testComponentSpectator = createTestComponent();
        testComponentSpectator.detectChanges();

        console.warn(testComponentSpectator.component);

        spectator = createComponent({
            props: {
                anchor: target,
                contentTemplate: testComponentSpectator.component.contentTemplate
            }
        });
    });

    it("should create", () => {
        expect(spectator.component).toBeTruthy();
    });
});
