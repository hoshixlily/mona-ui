import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { createComponentFactory, Spectator } from "@ngneat/spectator";

import { SwitchComponent } from "./switch.component";

describe("SwitchComponent", () => {
    let spectator: Spectator<SwitchComponent>;
    const createComponent = createComponentFactory({
        component: SwitchComponent,
        imports: [BrowserAnimationsModule]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
