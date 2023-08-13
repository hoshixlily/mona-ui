import { AnimationBuilder } from "@angular/animations";
import { TestBed } from "@angular/core/testing";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";

import { AnimationService } from "./animation.service";

describe("AnimationService", () => {
    let spectator: SpectatorService<AnimationService>;
    const createService = createServiceFactory({
        service: AnimationService,
        providers: [AnimationBuilder]
    });

    beforeEach(() => (spectator = createService()));

    it("should be created", () => {
        expect(spectator.service).toBeTruthy();
    });
});
