import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { ButtonModule } from "../../../buttons/modules/button/button.module";
import { SlicePipe } from "../../../pipes/slice.pipe";

import { PagerComponent } from "./pager.component";

describe("PagerComponent", () => {
    let spectator: Spectator<PagerComponent>;
    const createComponent = createComponentFactory({
        component: PagerComponent,
        imports: [SlicePipe, FontAwesomeTestingModule, ButtonModule]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
