import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { ButtonService } from "./button.service";

describe("ButtonService", () => {
    let spectator: SpectatorService<ButtonService>;
    let createService = createServiceFactory(ButtonService);

    beforeEach(() => {
        spectator = createService();
    });

    it("should create", () => {
        expect(spectator.service).toBeDefined();
    });
});
