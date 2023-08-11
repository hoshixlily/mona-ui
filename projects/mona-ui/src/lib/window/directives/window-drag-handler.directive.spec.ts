import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { WindowDragHandlerDirective } from "./window-drag-handler.directive";

describe("WindowDragHandlerDirective", () => {
    let spectator: SpectatorDirective<WindowDragHandlerDirective>;
    const createDirective = createDirectiveFactory(WindowDragHandlerDirective);

    beforeEach(() => {
        spectator = createDirective(`<div monaWindowDragHandler></div>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
