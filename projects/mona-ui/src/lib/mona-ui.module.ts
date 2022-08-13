import { NgModule } from "@angular/core";
import { ButtonsModule } from "./buttons/buttons.module";
import { PopupModule } from "./popup/popup.module";
import { MenusModule } from "./menus/menus.module";
import { DropDownsModule } from "./dropdowns/drop-downs.module";

@NgModule({
    exports: [ButtonsModule, DropDownsModule, MenusModule, PopupModule]
})
export class MonaUiModule {}
