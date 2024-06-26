import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GridService } from "../../services/grid.service";

import { GridVirtualListComponent } from "./grid-virtual-list.component";

describe("GridVirtualListComponent", () => {
    let component: GridVirtualListComponent;
    let fixture: ComponentFixture<GridVirtualListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GridVirtualListComponent],
            providers: [GridService]
        }).compileComponents();

        fixture = TestBed.createComponent(GridVirtualListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
