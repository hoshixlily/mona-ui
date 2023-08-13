import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { PopupAnimationService } from "../../../../../animations/popup-animation.service";
import { TextBoxModule } from "../../../../../inputs/modules/text-box/text-box.module";

import { DateTimePickerComponent } from "./date-time-picker.component";

describe("DateTimePickerComponent", () => {
    let spectator: Spectator<DateTimePickerComponent>;
    const createComponent = createComponentFactory({
        component: DateTimePickerComponent,
        imports: [FormsModule, BrowserAnimationsModule, FontAwesomeTestingModule, TextBoxModule],
        providers: [PopupAnimationService]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
