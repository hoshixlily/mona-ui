import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GridComponent } from "./components/grid/grid.component";
import { GridListComponent } from "./components/grid-list/grid-list.component";
import { GridColumnResizeHandlerDirective } from "./directives/grid-column-resize-handler.directive";
import { GridFilterMenuComponent } from "./components/grid-filter-menu/grid-filter-menu.component";
import { ButtonModule } from "../buttons/modules/button/button.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { GridFilterPipe } from "./pipes/grid-filter.pipe";
import { PagerModule } from "../pager/pager.module";
import { SlicePipe } from "../pipes/slice.pipe";
import { GridPagePipe } from "./pipes/grid-page.pipe";
import { GridColumnComponent } from "./components/grid-column/grid-column.component";
import { GridCellTemplateDirective } from "./directives/grid-cell-template.directive";

@NgModule({
    declarations: [
        GridComponent,
        GridListComponent,
        GridColumnResizeHandlerDirective,
        GridFilterMenuComponent,
        GridFilterPipe,
        GridPagePipe,
        GridColumnComponent,
        GridCellTemplateDirective
    ],
    imports: [CommonModule, ButtonModule, FontAwesomeModule, PagerModule, SlicePipe],
    exports: [GridComponent, GridColumnComponent, GridCellTemplateDirective]
})
export class GridModule {}
