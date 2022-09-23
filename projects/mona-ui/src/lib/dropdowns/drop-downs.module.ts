import { NgModule } from "@angular/core";
import { DropDownListModule } from "./modules/drop-down-list/drop-down-list.module";
import { ComboBoxModule } from "./modules/combo-box/combo-box.module";
import { MultiSelectModule } from "./modules/multi-select/multi-select.module";

@NgModule({
    exports: [ComboBoxModule, DropDownListModule, MultiSelectModule]
})
export class DropDownsModule {}
