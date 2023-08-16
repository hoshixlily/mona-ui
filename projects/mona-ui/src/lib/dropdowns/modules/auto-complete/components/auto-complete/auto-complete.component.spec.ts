import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { PopupAnimationService } from "../../../../../animations/popup-animation.service";

import { AutoCompleteComponent } from "./auto-complete.component";

describe("AutoCompleteComponent", () => {
    let spectator: Spectator<AutoCompleteComponent>;
    const createComponent = createComponentFactory({
        component: AutoCompleteComponent,
        imports: [FormsModule, BrowserAnimationsModule],
        providers: [PopupAnimationService]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
