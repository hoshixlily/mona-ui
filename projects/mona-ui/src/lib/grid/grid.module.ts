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
import { DragDropModule } from "@angular/cdk/drag-drop";
import { GridGroupPipe } from "./pipes/grid-group.pipe";
import { ChipModule } from "../buttons/modules/chip/chip.module";
import { GridSelectableDirective } from "./directives/grid-selectable.directive";
import { GridCellComponent } from "./components/grid-cell/grid-cell.component";
import { TextBoxModule } from "../inputs/modules/text-box/text-box.module";
import { ReactiveFormsModule } from "@angular/forms";
import { NumericTextBoxModule } from "../inputs/modules/numeric-text-box/numeric-text-box.module";
import { A11yModule } from "@angular/cdk/a11y";
import { DatePickerModule } from "../date-inputs/modules/date-picker/date-picker.module";
import { CheckBoxModule } from "../inputs/modules/check-box/check-box.module";
import { GridEditableDirective } from "./directives/grid-editable.directive";
import { GridColumnTitleTemplateDirective } from "./directives/grid-column-title-template.directive";

@NgModule({
    declarations: [
        GridComponent,
        GridListComponent,
        GridColumnResizeHandlerDirective,
        GridFilterMenuComponent,
        GridFilterPipe,
        GridPagePipe,
        GridColumnComponent,
        GridCellTemplateDirective,
        GridGroupPipe,
        GridSelectableDirective,
        GridCellComponent,
        GridEditableDirective,
        GridColumnTitleTemplateDirective
    ],
    imports: [
        CommonModule,
        ButtonModule,
        FontAwesomeModule,
        PagerModule,
        SlicePipe,
        DragDropModule,
        ChipModule,
        TextBoxModule,
        ReactiveFormsModule,
        NumericTextBoxModule,
        A11yModule,
        DatePickerModule,
        CheckBoxModule
    ],
    exports: [
        GridComponent,
        GridColumnComponent,
        GridColumnTitleTemplateDirective,
        GridCellTemplateDirective,
        GridEditableDirective,
        GridSelectableDirective
    ]
})
export class GridModule {}
