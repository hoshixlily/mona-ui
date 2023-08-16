import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { PopupAnimationService } from "../../../../../animations/popup-animation.service";
import { ButtonModule } from "../../../../../buttons/modules/button/button.module";

import { ColorPickerComponent } from "./color-picker.component";

describe("ColorPickerComponent", () => {
    let spectator: Spectator<ColorPickerComponent>;
    const createComponent = createComponentFactory({
        component: ColorPickerComponent,
        imports: [BrowserAnimationsModule, ButtonModule, FontAwesomeTestingModule],
        providers: [PopupAnimationService]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
