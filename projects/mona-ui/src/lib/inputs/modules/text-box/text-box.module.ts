import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TextBoxDirective } from "./directives/text-box.directive";
import { TextBoxComponent } from "./components/text-box/text-box.component";

@NgModule({
    declarations: [TextBoxDirective, TextBoxComponent],
    imports: [CommonModule],
    exports: [TextBoxDirective, TextBoxComponent]
})
export class TextBoxModule {}
