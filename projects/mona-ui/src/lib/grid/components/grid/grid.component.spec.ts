import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PagerComponent } from "../../../pager/components/pager/pager.component";

import { GridComponent } from "./grid.component";

describe("GridComponent", () => {
    let component: GridComponent;
    let fixture: ComponentFixture<GridComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [GridComponent, PagerComponent]
        });
        fixture = TestBed.createComponent(GridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
