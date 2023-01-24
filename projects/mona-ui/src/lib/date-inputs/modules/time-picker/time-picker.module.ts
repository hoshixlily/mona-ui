import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TimePickerComponent } from "./components/time-picker/time-picker.component";
import { TextBoxModule } from "../../../inputs/modules/text-box/text-box.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ButtonModule } from "../../../buttons/modules/button/button.module";
import { FormsModule } from "@angular/forms";
import { ComboBoxModule } from "../../../dropdowns/modules/combo-box/combo-box.module";
import { DropDownListModule } from "../../../dropdowns/modules/drop-down-list/drop-down-list.module";

@NgModule({
    declarations: [TimePickerComponent],
    imports: [
        CommonModule,
        TextBoxModule,
        FontAwesomeModule,
        ButtonModule,
        FormsModule,
        ComboBoxModule,
        DropDownListModule
    ],
    exports: [TimePickerComponent]
})
export class TimePickerModule {}
