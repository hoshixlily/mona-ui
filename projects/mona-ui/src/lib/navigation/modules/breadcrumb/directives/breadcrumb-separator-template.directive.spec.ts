import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { BreadcrumbSeparatorTemplateDirective } from "./breadcrumb-separator-template.directive";

describe("BreadcrumbSeparatorTemplateDirective", () => {
    let spectator: SpectatorDirective<BreadcrumbSeparatorTemplateDirective>;
    const createDirective = createDirectiveFactory(BreadcrumbSeparatorTemplateDirective);

    beforeEach(() => {
        spectator = createDirective(`<ng-template monaBreadcrumbSeparatorTemplate></ng-template>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
