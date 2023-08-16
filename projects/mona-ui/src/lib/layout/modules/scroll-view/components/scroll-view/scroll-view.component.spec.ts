import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";

import { ScrollViewComponent } from "./scroll-view.component";

describe("ScrollViewComponent", () => {
    let spectator: Spectator<ScrollViewComponent>;
    const createComponent = createComponentFactory({
        component: ScrollViewComponent,
        imports: [FontAwesomeTestingModule]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
