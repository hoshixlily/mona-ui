import { NgModule } from "@angular/core";
import { DropDownListModule } from "./modules/drop-down-list/drop-down-list.module";
import { ComboBoxModule } from "./modules/combo-box/combo-box.module";

@NgModule({
    exports: [ComboBoxModule, DropDownListModule]
})
export class DropDownsModule {}
