import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { PopupListService } from "../../services/popup-list.service";

import { PopupListComponent } from "./popup-list.component";

describe("PopupListComponent", () => {
    let spectator: Spectator<PopupListComponent>;
    const createComponent = createComponentFactory({
        component: PopupListComponent,
        providers: [PopupListService]
    });

    beforeEach(() => (spectator = createComponent()));

    it("should create", () => {
        expect(spectator.component).toBeTruthy();
    });
});
