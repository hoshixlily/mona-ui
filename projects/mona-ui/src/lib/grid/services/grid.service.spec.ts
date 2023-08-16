import { createServiceFactory, SpectatorService } from "@ngneat/spectator";

import { GridService } from "./grid.service";

describe("GridService", () => {
    let spectator: SpectatorService<GridService>;
    const createService = createServiceFactory({
        service: GridService
    });

    beforeEach(() => (spectator = createService()));

    it("should be created", () => {
        expect(spectator.service).toBeTruthy();
    });
});
