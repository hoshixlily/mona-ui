import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";

import { ExpansionPanelComponent } from "./expansion-panel.component";

describe("ExpansionPanelComponent", () => {
    let spectator: Spectator<ExpansionPanelComponent>;
    const createComponent = createComponentFactory({
        component: ExpansionPanelComponent,
        imports: [FontAwesomeTestingModule]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
