import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { ContextMenuModule } from "../../../../../menus/modules/context-menu/context-menu.module";

import { DropDownButtonComponent } from "./drop-down-button.component";

describe("DropDownButtonComponent", () => {
    let spectator: Spectator<DropDownButtonComponent>;
    const createComponent = createComponentFactory({
        component: DropDownButtonComponent,
        imports: [ContextMenuModule]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
