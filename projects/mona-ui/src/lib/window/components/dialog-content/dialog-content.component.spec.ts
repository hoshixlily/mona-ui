import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";

import { DialogContentComponent } from "./dialog-content.component";

describe("DialogContentComponent", () => {
    let spectator: Spectator<DialogContentComponent>;
    const createComponent = createComponentFactory({
        component: DialogContentComponent,
        imports: [FontAwesomeTestingModule]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
