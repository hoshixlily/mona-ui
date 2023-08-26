import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GridService } from "../../services/grid.service";

import { GridListComponent } from "./grid-list.component";

describe("GridListComponent", () => {
    let component: GridListComponent;
    let fixture: ComponentFixture<GridListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [GridListComponent],
            providers: [GridService]
        });
        fixture = TestBed.createComponent(GridListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
