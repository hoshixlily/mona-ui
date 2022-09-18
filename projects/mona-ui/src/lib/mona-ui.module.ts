import { NgModule } from "@angular/core";
import { ButtonsModule } from "./buttons/buttons.module";
import { PopupModule } from "./popup/popup.module";
import { MenusModule } from "./menus/menus.module";
import { DropDownsModule } from "./dropdowns/drop-downs.module";
import { InputsModule } from "./inputs/inputs.module";

@NgModule({
    exports: [ButtonsModule, DropDownsModule, InputsModule, MenusModule, PopupModule]
})
export class MonaUiModule {}
