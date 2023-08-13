import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { ListViewHeaderTemplateDirective } from "./list-view-header-template.directive";

describe("ListViewHeaderTemplateDirective", () => {
    let spectator: SpectatorDirective<ListViewHeaderTemplateDirective>;
    const createDirective = createDirectiveFactory(ListViewHeaderTemplateDirective);

    beforeEach(() => {
        spectator = createDirective(`<ng-template monaListViewHeaderTemplate></ng-template>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
