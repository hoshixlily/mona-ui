import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { ContextMenuService } from "../../services/context-menu.service";

import { ContextMenuComponent } from "./context-menu.component";

describe("ContextMenuComponent", () => {
    let spectator: Spectator<ContextMenuComponent>;
    const createComponent = createComponentFactory({
        component: ContextMenuComponent,
        providers: [ContextMenuService]
    });

    beforeEach(() => {
        const target = document.createElement("div");
        spectator = createComponent({
            props: {
                target
            }
        });
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
