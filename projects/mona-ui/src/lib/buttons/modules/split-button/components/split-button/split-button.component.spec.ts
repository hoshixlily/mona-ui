import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { ContextMenuModule } from "../../../../../menus/modules/context-menu/context-menu.module";

import { SplitButtonComponent } from "./split-button.component";

describe("SplitButtonComponent", () => {
    let spectator: Spectator<SplitButtonComponent>;
    const createComponent = createComponentFactory({
        component: SplitButtonComponent,
        imports: [ContextMenuModule, FontAwesomeTestingModule]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
