import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { ContextMenuService } from "../../services/context-menu.service";

import { ContextMenuItemComponent } from "./context-menu-item.component";

describe("ContextMenuItemComponent", () => {
    let spectator: Spectator<ContextMenuItemComponent>;
    const createComponent = createComponentFactory({
        component: ContextMenuItemComponent,
        providers: [ContextMenuService]
    });

    beforeEach(() => {
        spectator = createComponent({
            props: {
                menuItem: {
                    parent: null
                }
            }
        });
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
