import { NgModule } from "@angular/core";
import { ButtonsModule } from "./buttons/buttons.module";
import { PopupModule } from "./popup/popup.module";

@NgModule({
    declarations: [],
    imports: [ButtonsModule, PopupModule],
    exports: [ButtonsModule, PopupModule]
})
export class MonaUiModule {}
