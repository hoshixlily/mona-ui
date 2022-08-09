import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "./modules/button/button.module";
import { ButtonGroupModule } from "./modules/button-group/button-group.module";
import { SplitButtonModule } from "./modules/split-button/split-button.module";

@NgModule({
    declarations: [],
    imports: [CommonModule],
    exports: [ButtonModule, ButtonGroupModule, SplitButtonModule]
})
export class ButtonsModule {}
