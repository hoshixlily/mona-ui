import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { ListViewGroupTemplateDirective } from "./list-view-group-template.directive";

describe("ListViewGroupTemplateDirective", () => {
    let spectator: SpectatorDirective<ListViewGroupTemplateDirective>;
    const createDirective = createDirectiveFactory({
        directive: ListViewGroupTemplateDirective
    });

    beforeEach(() => {
        spectator = createDirective(`<ng-template monaListViewGroupTemplate></ng-template>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
