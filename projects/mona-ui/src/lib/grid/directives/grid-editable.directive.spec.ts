import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { GridService } from "../services/grid.service";
import { GridEditableDirective } from "./grid-editable.directive";

describe("GridEditableDirective", () => {
    let spectator: SpectatorDirective<GridEditableDirective>;
    const createDirective = createDirectiveFactory({
        directive: GridEditableDirective,
        providers: [GridService]
    });

    beforeEach(() => {
        spectator = createDirective(`<mona-grid monaGridEditable></mona-grid>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
