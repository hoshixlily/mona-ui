import { DragDropModule } from "@angular/cdk/drag-drop";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { PagerModule } from "../../../pager/pager.module";
import { GridFilterPipe } from "../../pipes/grid-filter.pipe";
import { GridPagePipe } from "../../pipes/grid-page.pipe";
import { GridListComponent } from "../grid-list/grid-list.component";

import { GridComponent } from "./grid.component";

describe("GridComponent", () => {
    let spectator: Spectator<GridComponent>;
    const createComponent = createComponentFactory({
        component: GridComponent,
        imports: [PagerModule, DragDropModule],
        declarations: [GridFilterPipe, GridPagePipe, GridListComponent]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeTruthy();
    });
});
