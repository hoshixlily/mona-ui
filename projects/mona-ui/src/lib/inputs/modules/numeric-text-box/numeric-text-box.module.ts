import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NumericTextBoxComponent } from "./components/numeric-text-box/numeric-text-box.component";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ButtonModule } from "../../../buttons/modules/button/button.module";
import { TextBoxModule } from "../text-box/text-box.module";
import { NumericTextBoxPrefixTemplateDirective } from "./directives/numeric-text-box-prefix-template.directive";

@NgModule({
    declarations: [NumericTextBoxComponent, NumericTextBoxPrefixTemplateDirective],
    imports: [CommonModule, FormsModule, FontAwesomeModule, ButtonModule, TextBoxModule],
    exports: [NumericTextBoxComponent, NumericTextBoxPrefixTemplateDirective]
})
export class NumericTextBoxModule {}
