import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DropDownListModule } from "./modules/drop-down-list/drop-down-list.module";
import { ComboBoxModule } from "./modules/combo-box/combo-box.module";
import { MultiSelectModule } from "./modules/multi-select/multi-select.module";

@NgModule({
    declarations: [],
    imports: [CommonModule],
    exports: [ComboBoxModule, DropDownListModule, MultiSelectModule]
})
export class DropDownsModule {}
