import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { PopupAnimationService } from "../../../../../animations/popup-animation.service";
import { TextBoxDirective } from "../../../../../inputs/modules/text-box/directives/text-box.directive";
import { TextBoxModule } from "../../../../../inputs/modules/text-box/text-box.module";
import { TimeSelectorModule } from "../../../time-selector/time-selector.module";

import { TimePickerComponent } from "./time-picker.component";

describe("TimePickerComponent", () => {
    let spectator: Spectator<TimePickerComponent>;
    const createComponent = createComponentFactory({
        component: TimePickerComponent,
        imports: [FormsModule, BrowserAnimationsModule, FontAwesomeTestingModule, TextBoxModule, TimeSelectorModule],
        providers: [PopupAnimationService],
        declarations: [TextBoxDirective]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
