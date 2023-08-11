import { TestBed } from "@angular/core/testing";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";

import { PopupListService } from "./popup-list.service";

describe("PopupListService", () => {
    let spectator: SpectatorService<PopupListService>;
    const createService = createServiceFactory(PopupListService);

    beforeEach(() => {
        spectator = createService();
    });

    it("should create", () => {
        expect(spectator.service).toBeDefined();
    });
});
