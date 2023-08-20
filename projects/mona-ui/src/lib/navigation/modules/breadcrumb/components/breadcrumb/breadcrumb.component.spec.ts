import { createComponentFactory, Spectator } from "@ngneat/spectator";

import { BreadcrumbComponent } from "./breadcrumb.component";

describe("BreadcrumbComponent", () => {
    let spectator: Spectator<BreadcrumbComponent>;
    const createComponent = createComponentFactory({
        component: BreadcrumbComponent,
        imports: []
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeTruthy();
    });
});
