import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "./modules/button/button.module";
import { ButtonGroupModule } from "./modules/button-group/button-group.module";
import { SplitButtonModule } from "./modules/split-button/split-button.module";
import { ChipModule } from "./modules/chip/chip.module";

@NgModule({
    declarations: [],
    imports: [],
    exports: [ButtonModule, ButtonGroupModule, SplitButtonModule, ChipModule]
})
export class ButtonsModule {}
