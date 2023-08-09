import { NgModule } from "@angular/core";
import { ButtonGroupModule } from "./modules/button-group/button-group.module";
import { ButtonModule } from "./modules/button/button.module";
import { ChipModule } from "./modules/chip/chip.module";
import { DropDownButtonModule } from "./modules/drop-down-button/drop-down-button.module";
import { SplitButtonModule } from "./modules/split-button/split-button.module";

@NgModule({
    declarations: [],
    imports: [],
    exports: [ButtonModule, ButtonGroupModule, DropDownButtonModule, SplitButtonModule, ChipModule]
})
export class ButtonsModule {}
