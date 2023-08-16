import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { PopupAnimationService } from "../../../../../animations/popup-animation.service";

import { TooltipComponent } from "./tooltip.component";

describe("TooltipComponent", () => {
    let spectator: Spectator<TooltipComponent>;
    const createComponent = createComponentFactory({
        component: TooltipComponent,
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
