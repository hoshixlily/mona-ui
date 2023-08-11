import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { GridCellTemplateDirective } from "./grid-cell-template.directive";

describe("GridCellTemplateDirective", () => {
    let spectator: SpectatorDirective<GridCellTemplateDirective>;
    const createDirective = createDirectiveFactory(GridCellTemplateDirective);

    beforeEach(() => {
        spectator = createDirective(`<ng-template monaGridCellTemplate></ng-template>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
