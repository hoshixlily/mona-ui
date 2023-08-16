import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { Column } from "../../models/Column";
import { Row } from "../../models/Row";
import { GridService } from "../../services/grid.service";

import { GridCellComponent } from "./grid-cell.component";

describe("GridCellComponent", () => {
    let spectator: Spectator<GridCellComponent>;
    const createComponent = createComponentFactory({
        component: GridCellComponent,
        providers: [GridService]
    });
    const column: Column = new Column();
    column.field = "test";

    const row: Row = new Row({ test: "test" });

    beforeEach(() => {
        spectator = createComponent({
            props: {
                column,
                row
            }
        });
    });

    it("should create", () => {
        expect(spectator.component).toBeTruthy();
    });
});
