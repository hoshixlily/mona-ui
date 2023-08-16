import { createServiceFactory, SpectatorService } from "@ngneat/spectator";

import { TooltipService } from "./tooltip.service";

describe("TooltipService", () => {
    let spectator: SpectatorService<TooltipService>;
    const createService = createServiceFactory({
        service: TooltipService
    });

    beforeEach(() => {
        spectator = createService();
    });

    it("should be created", () => {
        expect(spectator.service).toBeTruthy();
    });
});
