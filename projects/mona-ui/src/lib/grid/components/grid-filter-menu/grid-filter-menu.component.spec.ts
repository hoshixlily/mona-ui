import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PopupAnimationService } from "../../../animations/services/popup-animation.service";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { FilterMenuComponent } from "../../../filter/components/filter-menu/filter-menu.component";
import { Column } from "../../models/Column";
import { GridService } from "../../services/grid.service";

import { GridFilterMenuComponent } from "./grid-filter-menu.component";

@Component({
    template: ` <mona-grid-filter-menu [column]="column"></mona-grid-filter-menu> `,
    imports: [GridFilterMenuComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
class GridFilterMenuComponentTest {
    public column: Column = new Column();
}

describe("GridFilterMenuComponent", () => {
    let component: GridFilterMenuComponent;
    let hostComponent: GridFilterMenuComponentTest;
    let fixture: ComponentFixture<GridFilterMenuComponent>;
    let hostFixture: ComponentFixture<GridFilterMenuComponentTest>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [GridFilterMenuComponent, ButtonDirective, FilterMenuComponent, BrowserAnimationsModule],
            providers: [PopupAnimationService, GridService]
        });
        hostFixture = TestBed.createComponent(GridFilterMenuComponentTest);
        hostComponent = hostFixture.componentInstance;
    });

    it("should create", () => {
        expect(hostComponent).toBeTruthy();
    });
});
