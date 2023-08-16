import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { PopupAnimationService } from "../../../../../animations/popup-animation.service";

import { DropDownListComponent } from "./drop-down-list.component";

describe("DropDownListComponent", () => {
    let spectator: Spectator<DropDownListComponent>;
    const createComponent = createComponentFactory({
        component: DropDownListComponent,
        imports: [BrowserAnimationsModule, FontAwesomeTestingModule],
        providers: [PopupAnimationService]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
