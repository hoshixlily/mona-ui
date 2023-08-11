import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { WindowResizeHandlerDirective } from "./window-resize-handler.directive";

describe("WindowResizeHandlerDirective", () => {
    let spectator: SpectatorDirective<WindowResizeHandlerDirective>;
    const createDirective = createDirectiveFactory(WindowResizeHandlerDirective);

    beforeEach(() => {
        spectator = createDirective(`<div monaWindowResizeHandler></div>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
