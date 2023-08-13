import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { ButtonModule } from "../../../buttons/modules/button/button.module";
import { Column } from "../../models/Column";
import { GridService } from "../../services/grid.service";

import { GridFilterMenuComponent } from "./grid-filter-menu.component";

describe("GridFilterMenuComponent", () => {
    let spectator: Spectator<GridFilterMenuComponent>;
    const createComponent = createComponentFactory({
        component: GridFilterMenuComponent,
        imports: [BrowserAnimationsModule, FontAwesomeTestingModule, ButtonModule],
        providers: [GridService]
    });
    let column: Column;

    beforeEach(() => {
        column = new Column();
        column.field = "test";
        spectator = createComponent({
            props: {
                column
            }
        });
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
