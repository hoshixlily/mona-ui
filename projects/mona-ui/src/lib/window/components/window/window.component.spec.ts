import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { WindowService } from "../../services/window.service";
import { WindowComponent } from "./window.component";

describe("WindowComponent", () => {
    let spectator: Spectator<WindowComponent>;
    let createComponent = createComponentFactory({
        component: WindowComponent,
        providers: [WindowService]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
