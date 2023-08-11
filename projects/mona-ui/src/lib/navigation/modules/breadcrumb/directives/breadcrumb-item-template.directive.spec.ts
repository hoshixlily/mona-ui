import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { BreadcrumbItemTemplateDirective } from "./breadcrumb-item-template.directive";

describe("BreadcrumbItemTemplateDirective", () => {
    let spectator: SpectatorDirective<BreadcrumbItemTemplateDirective>;
    const createDirective = createDirectiveFactory(BreadcrumbItemTemplateDirective);

    beforeEach(() => {
        spectator = createDirective(`<ng-template monaBreadcrumbItemTemplate></ng-template>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
