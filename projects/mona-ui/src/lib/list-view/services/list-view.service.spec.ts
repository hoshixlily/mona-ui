import { createServiceFactory, SpectatorService } from "@ngneat/spectator";

import { ListViewService } from "./list-view.service";

describe("ListViewService", () => {
    let spectator: SpectatorService<ListViewService>;
    const createService = createServiceFactory({
        service: ListViewService
    });

    beforeEach(() => (spectator = createService()));

    it("should be created", () => {
        expect(spectator.service).toBeTruthy();
    });
});
