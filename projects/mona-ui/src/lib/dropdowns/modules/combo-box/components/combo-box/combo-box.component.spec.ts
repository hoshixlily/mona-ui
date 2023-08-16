import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { PopupAnimationService } from "../../../../../animations/popup-animation.service";
import { TextBoxModule } from "../../../../../inputs/modules/text-box/text-box.module";

import { ComboBoxComponent } from "./combo-box.component";

describe("ComboBoxComponent", () => {
    let spectator: Spectator<ComboBoxComponent>;
    let createComponent = createComponentFactory({
        component: ComboBoxComponent,
        imports: [BrowserAnimationsModule, TextBoxModule, FontAwesomeTestingModule, FormsModule],
        providers: [PopupAnimationService]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
