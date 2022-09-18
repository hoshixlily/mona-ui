import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TextBoxDirective } from "./directives/text-box.directive";
import { TextBoxComponent } from "./components/text-box/text-box.component";
import { TextBoxPrefixTemplateDirective } from "./directives/text-box-prefix-template.directive";
import { TextBoxSuffixTemplateDirective } from "./directives/text-box-suffix-template.directive";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [TextBoxDirective, TextBoxComponent, TextBoxPrefixTemplateDirective, TextBoxSuffixTemplateDirective],
    imports: [CommonModule, FormsModule],
    exports: [TextBoxDirective, TextBoxComponent, TextBoxPrefixTemplateDirective, TextBoxSuffixTemplateDirective]
})
export class TextBoxModule {}
