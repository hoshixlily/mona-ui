import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GridComponent } from "./components/grid/grid.component";
import { GridListComponent } from './components/grid-list/grid-list.component';
import { GridColumnResizeHandlerDirective } from './directives/grid-column-resize-handler.directive';

@NgModule({
    declarations: [GridComponent, GridListComponent, GridColumnResizeHandlerDirective],
    imports: [CommonModule],
    exports: [GridComponent]
})
export class GridModule {}
