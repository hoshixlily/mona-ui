import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NumericTextBoxComponent } from "./components/numeric-text-box/numeric-text-box.component";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ButtonModule } from "../../../buttons/modules/button/button.module";

@NgModule({
    declarations: [NumericTextBoxComponent],
    imports: [CommonModule, FormsModule, FontAwesomeModule, ButtonModule],
    exports: [NumericTextBoxComponent]
})
export class NumericTextBoxModule {}
