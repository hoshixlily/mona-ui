import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { PopupAnimationService } from "../../../../../animations/popup-animation.service";

import { PopoverComponent } from "./popover.component";

describe("PopoverComponent", () => {
    let spectator: Spectator<PopoverComponent>;
    const createComponent = createComponentFactory({
        component: PopoverComponent,
        imports: [BrowserAnimationsModule],
        providers: [PopupAnimationService]
    });

    beforeEach(() => {
        const target = document.createElement("div");
        spectator = createComponent({
            props: {
                target
            }
        });
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
