import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { GridService } from "../../services/grid.service";

import { GridListComponent } from "./grid-list.component";

describe("GridListComponent", () => {
    let spectator: Spectator<GridListComponent>;
    const createComponent = createComponentFactory({
        component: GridListComponent,
        providers: [GridService]
    });

    beforeEach(() => (spectator = createComponent()));

    it("should create", () => {
        expect(spectator.component).toBeTruthy();
    });
});
