import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NumericTextBoxComponent } from "./components/numeric-text-box/numeric-text-box.component";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
    declarations: [NumericTextBoxComponent],
    imports: [CommonModule, FormsModule, FontAwesomeModule],
    exports: [NumericTextBoxComponent]
})
export class NumericTextBoxModule {}
