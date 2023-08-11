import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { WindowTitleTemplateDirective } from "./window-title-template.directive";

describe("WindowTitleTemplateDirective", () => {
    let spectator: SpectatorDirective<WindowTitleTemplateDirective>;
    const createDirective = createDirectiveFactory(WindowTitleTemplateDirective);

    beforeEach(() => {
        spectator = createDirective(`<ng-template monaWindowTitleTemplate></ng-template>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
