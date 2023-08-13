import { FormsModule } from "@angular/forms";
import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";

import { NumericTextBoxComponent } from "./numeric-text-box.component";

describe("NumericTextBoxComponent", () => {
    let spectator: Spectator<NumericTextBoxComponent>;
    const createComponent = createComponentFactory({
        component: NumericTextBoxComponent,
        imports: [FontAwesomeTestingModule, FormsModule]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
