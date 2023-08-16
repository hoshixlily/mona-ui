import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { AnimationService } from "../../animations/animation.service";

import { DialogService } from "./dialog.service";

describe("DialogService", () => {
    let spectator: SpectatorService<DialogService>;
    const createService = createServiceFactory({
        service: DialogService,
        imports: [BrowserAnimationsModule],
        providers: [AnimationService]
    });

    beforeEach(() => (spectator = createService()));

    it("should be created", () => {
        expect(spectator.service).toBeTruthy();
    });
});
