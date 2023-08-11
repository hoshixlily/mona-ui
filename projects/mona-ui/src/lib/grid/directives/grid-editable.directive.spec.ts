import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { GridEditableDirective } from "./grid-editable.directive";

describe("GridEditableDirective", () => {
    let spectator: SpectatorDirective<GridEditableDirective>;
    const createDirective = createDirectiveFactory(GridEditableDirective);

    beforeEach(() => {
        spectator = createDirective(`<mona-grid monaGridEditable></mona-grid>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
