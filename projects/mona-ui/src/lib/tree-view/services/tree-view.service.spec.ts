import { createServiceFactory, SpectatorService } from "@ngneat/spectator";

import { TreeViewService } from "./tree-view.service";

describe("TreeViewService", () => {
    let spectator: SpectatorService<TreeViewService>;
    const createService = createServiceFactory(TreeViewService);

    beforeEach(() => (spectator = createService()));

    it("should be created", () => {
        expect(spectator.service).toBeTruthy();
    });
});
