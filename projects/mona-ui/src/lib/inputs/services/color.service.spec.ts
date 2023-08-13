import { createServiceFactory, SpectatorService } from "@ngneat/spectator";

import { ColorService } from "./color.service";

describe("ColorService", () => {
    let spectator: SpectatorService<ColorService>;
    const createService = createServiceFactory({
        service: ColorService
    });

    beforeEach(() => (spectator = createService()));

    it("should be created", () => {
        expect(spectator.service).toBeTruthy();
    });
});
