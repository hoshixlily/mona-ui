import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Column } from "../../models/Column";
import { Row } from "../../models/Row";
import { GridService } from "../../services/grid.service";

import { GridCellComponent } from "./grid-cell.component";

@Component({
    template: ` <mona-grid-cell [column]="column" [row]="row"></mona-grid-cell> `,
    imports: [GridCellComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
class GridCellComponentTest {
    public column: Column = new Column();
    public row: Row = new Row({ test: "test" });
}

describe("GridCellComponent", () => {
    let component: GridCellComponent;
    let hostComponent: GridCellComponentTest;
    let fixture: ComponentFixture<GridCellComponent>;
    let hostFixture: ComponentFixture<GridCellComponentTest>;
    let column: Column;
    let row: Row;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [GridCellComponent, GridCellComponentTest],
            providers: [GridService]
        });
        hostFixture = TestBed.createComponent(GridCellComponentTest);
        hostComponent = hostFixture.componentInstance;
        hostFixture.detectChanges();
    });

    it("should create", () => {
        expect(hostComponent).toBeTruthy();
    });
});
