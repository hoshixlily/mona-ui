import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { GridColumnTitleTemplateDirective } from "./grid-column-title-template.directive";

describe("GridColumnTitleTemplateDirective", () => {
    let spectator: SpectatorDirective<GridColumnTitleTemplateDirective>;
    const createDirective = createDirectiveFactory(GridColumnTitleTemplateDirective);

    beforeEach(() => {
        spectator = createDirective(`<ng-template monaGridColumnTitleTemplate></ng-template>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
