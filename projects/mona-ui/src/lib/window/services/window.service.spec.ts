import { TestBed } from "@angular/core/testing";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { AnimationService } from "../../animations/animation.service";

import { WindowService } from "./window.service";

describe("WindowService", () => {
    let spectator: SpectatorService<WindowService>;
    const createService = createServiceFactory({
        service: WindowService,
        providers: [AnimationService]
    });

    beforeEach(() => (spectator = createService()));

    it("should be created", () => {
        expect(spectator.service).toBeTruthy();
    });
});
