import { TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";

import { PopupAnimationService } from "./popup-animation.service";

describe("PopupAnimationService", () => {
    let spectator: SpectatorService<PopupAnimationService>;
    const createService = createServiceFactory({
        service: PopupAnimationService,
        imports: [BrowserAnimationsModule]
    });

    beforeEach(() => (spectator = createService()));

    it("should be created", () => {
        expect(spectator.service).toBeTruthy();
    });
});
