import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PopupAnimationService } from "../../../animations/popup-animation.service";
import { ButtonDirective } from "../../../buttons/modules/button/directives/button.directive";
import { FilterMenuComponent } from "../../../filter/components/filter-menu/filter-menu.component";
import { Column } from "../../models/Column";
import { GridService } from "../../services/grid.service";

import { GridFilterMenuComponent } from "./grid-filter-menu.component";

describe("GridFilterMenuComponent", () => {
    let component: GridFilterMenuComponent;
    let fixture: ComponentFixture<GridFilterMenuComponent>;
    let column: Column;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [GridFilterMenuComponent, ButtonDirective, FilterMenuComponent, BrowserAnimationsModule],
            providers: [PopupAnimationService, GridService]
        });
        fixture = TestBed.createComponent(GridFilterMenuComponent);
        component = fixture.componentInstance;
        column = new Column();
        column.field = "test";
        component.column = column;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
