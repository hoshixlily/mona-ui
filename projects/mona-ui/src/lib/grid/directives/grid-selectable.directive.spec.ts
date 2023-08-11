import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { GridComponent } from "../components/grid/grid.component";
import { GridSelectableDirective } from "./grid-selectable.directive";

describe("GridSelectableDirective", () => {
    let spectator: SpectatorDirective<GridSelectableDirective>;
    const createDirective = createDirectiveFactory({
        directive: GridSelectableDirective,
        host: GridComponent
    });

    beforeEach(() => {
        spectator = createDirective(`<mona-grid monaGridSelectable></mona-grid>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
