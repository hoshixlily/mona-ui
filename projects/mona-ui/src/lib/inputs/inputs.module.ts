import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TextBoxModule } from "./modules/text-box/text-box.module";
import { TextAreaModule } from "./modules/text-area/text-area.module";
import { CheckBoxModule } from "./modules/check-box/check-box.module";

@NgModule({
    declarations: [],
    imports: [CommonModule],
    exports: [CheckBoxModule, TextAreaModule, TextBoxModule]
})
export class InputsModule {}
