import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { PopupAnimationService } from "../../../../../animations/popup-animation.service";
import { PopupListService } from "../../../../services/popup-list.service";

import { MultiSelectComponent } from "./multi-select.component";

describe("MultiSelectComponent", () => {
    let spectator: Spectator<MultiSelectComponent>;
    const createComponent = createComponentFactory({
        component: MultiSelectComponent,
        imports: [BrowserAnimationsModule, FontAwesomeTestingModule],
        providers: [PopupAnimationService, PopupListService]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
