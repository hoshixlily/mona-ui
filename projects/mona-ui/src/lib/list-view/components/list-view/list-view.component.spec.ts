import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { PagerModule } from "../../../pager/pager.module";

import { ListViewComponent } from "./list-view.component";

describe("ListViewComponent", () => {
    let spectator: Spectator<ListViewComponent>;
    const createComponent = createComponentFactory({
        component: ListViewComponent,
        imports: [PagerModule]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
