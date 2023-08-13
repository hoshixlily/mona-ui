import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { PopupAnimationService } from "../../../../../animations/popup-animation.service";
import { TextBoxModule } from "../../../../../inputs/modules/text-box/text-box.module";

import { DatePickerComponent } from "./date-picker.component";

describe("DatePickerComponent", () => {
    let spectator: Spectator<DatePickerComponent>;
    const createComponent = createComponentFactory({
        component: DatePickerComponent,
        imports: [FormsModule, BrowserAnimationsModule, TextBoxModule, FontAwesomeTestingModule],
        providers: [PopupAnimationService]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
