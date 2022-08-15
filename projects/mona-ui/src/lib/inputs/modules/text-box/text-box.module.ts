import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TextBoxDirective } from "./directives/text-box.directive";

@NgModule({
    declarations: [TextBoxDirective],
    imports: [CommonModule],
    exports: [TextBoxDirective]
})
export class TextBoxModule {}
