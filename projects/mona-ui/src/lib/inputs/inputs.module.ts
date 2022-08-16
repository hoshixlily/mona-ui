import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TextBoxModule } from "./modules/text-box/text-box.module";
import { TextAreaModule } from "./modules/text-area/text-area.module";

@NgModule({
    declarations: [],
    imports: [CommonModule],
    exports: [TextBoxModule, TextAreaModule]
})
export class InputsModule {}
