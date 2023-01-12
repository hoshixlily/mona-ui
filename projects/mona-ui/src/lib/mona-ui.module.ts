import { NgModule } from "@angular/core";
import { ButtonsModule } from "./buttons/buttons.module";
import { PopupModule } from "./popup/popup.module";
import { MenusModule } from "./menus/menus.module";
import { DropDownsModule } from "./dropdowns/drop-downs.module";
import { InputsModule } from "./inputs/inputs.module";
import { TreeViewModule } from "./tree-view/tree-view.module";
import { LayoutModule } from "./layout/layout.module";
import { SlicePipe } from './pipes/slice.pipe';

@NgModule({
    exports: [
        ButtonsModule,
        DropDownsModule,
        InputsModule,
        LayoutModule,
        MenusModule,
        PopupModule,
        TreeViewModule,
        SlicePipe
    ],
    declarations: [SlicePipe]
})
export class MonaUiModule {}
