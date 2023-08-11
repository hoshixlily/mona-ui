import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { MenuTextTemplateDirective } from "./menu-text-template.directive";

describe("MenuTextTemplateDirective", () => {
    let spectator: SpectatorDirective<MenuTextTemplateDirective>;
    const createDirective = createDirectiveFactory(MenuTextTemplateDirective);

    beforeEach(() => {
        spectator = createDirective(`<ng-template monaMenuTextTemplate></ng-template>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
