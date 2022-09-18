import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComboBoxComponent } from "./components/combo-box/combo-box.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TextBoxModule } from "../../../inputs/modules/text-box/text-box.module";
import { SharedModule } from "../../../shared/shared.module";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [ComboBoxComponent],
    imports: [CommonModule, FontAwesomeModule, TextBoxModule, SharedModule, FormsModule],
    exports: [ComboBoxComponent]
})
export class ComboBoxModule {}
