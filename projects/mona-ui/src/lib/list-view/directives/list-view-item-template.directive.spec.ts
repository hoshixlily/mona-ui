import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { ListViewItemTemplateDirective } from "./list-view-item-template.directive";

describe("ListViewItemTemplateDirective", () => {
    let spectator: SpectatorDirective<ListViewItemTemplateDirective>;
    const createDirective = createDirectiveFactory(ListViewItemTemplateDirective);

    beforeEach(() => {
        spectator = createDirective(`<ng-template monaListViewItemTemplate></ng-template>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
