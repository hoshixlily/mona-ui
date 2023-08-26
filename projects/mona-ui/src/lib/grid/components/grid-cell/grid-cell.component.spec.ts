import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Column } from "../../models/Column";
import { Row } from "../../models/Row";
import { GridService } from "../../services/grid.service";

import { GridCellComponent } from "./grid-cell.component";

describe("GridCellComponent", () => {
    let component: GridCellComponent;
    let fixture: ComponentFixture<GridCellComponent>;
    let column: Column;
    let row: Row;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [GridCellComponent],
            providers: [GridService]
        });
        fixture = TestBed.createComponent(GridCellComponent);

        component = fixture.componentInstance;
        column = new Column();
        column.field = "test";
        row = new Row({ test: "test" });

        component.column = column;
        component.row = row;

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
