import { createComponentFactory, mockProvider, Spectator } from "@ngneat/spectator";
import { PopupRef, PopupService } from "mona-ui";
import { TestComponentComponent } from "./test-component.component";

describe("TestComponentComponent", () => {
    let spectator: Spectator<TestComponentComponent>;
    const createComponent = createComponentFactory({
        component: TestComponentComponent,
        providers: [PopupService, mockProvider(PopupRef)]
    });

    beforeEach(() => (spectator = createComponent()));

    it("should create", () => {
        expect(spectator.component).toBeTruthy();
    });
});
