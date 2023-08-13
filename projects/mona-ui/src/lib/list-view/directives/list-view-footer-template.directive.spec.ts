import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { ListViewFooterTemplateDirective } from "./list-view-footer-template.directive";

describe("ListViewFooterTemplateDirective", () => {
    let spectator: SpectatorDirective<ListViewFooterTemplateDirective>;
    const createDirective = createDirectiveFactory(ListViewFooterTemplateDirective);

    beforeEach(() => {
        spectator = createDirective(`<ng-template monaListViewFooterTemplate></ng-template>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
