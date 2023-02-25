import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GridComponent } from "./components/grid/grid.component";
import { GridListComponent } from "./components/grid-list/grid-list.component";
import { GridColumnResizeHandlerDirective } from "./directives/grid-column-resize-handler.directive";
import { GridFilterMenuComponent } from "./components/grid-filter-menu/grid-filter-menu.component";
import { ButtonModule } from "../buttons/modules/button/button.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { GridFilterPipe } from "./pipes/grid-filter.pipe";

@NgModule({
    declarations: [
        GridComponent,
        GridListComponent,
        GridColumnResizeHandlerDirective,
        GridFilterMenuComponent,
        GridFilterPipe
    ],
    imports: [CommonModule, ButtonModule, FontAwesomeModule],
    exports: [GridComponent]
})
export class GridModule {}
