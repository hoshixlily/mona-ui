import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FilterMenuComponent } from "./components/filter-menu/filter-menu.component";
import { DropDownListModule } from "../dropdowns/modules/drop-down-list/drop-down-list.module";
import { TextBoxModule } from "../inputs/modules/text-box/text-box.module";
import { ButtonModule } from "../buttons/modules/button/button.module";
import { FormsModule } from "@angular/forms";
import { NumericTextBoxModule } from "../inputs/modules/numeric-text-box/numeric-text-box.module";
import { DatePickerModule } from "../date-inputs/modules/date-picker/date-picker.module";
import { DateTimePickerModule } from "../date-inputs/modules/date-time-picker/date-time-picker.module";
import { TimePickerModule } from "../date-inputs/modules/time-picker/time-picker.module";
import { ButtonGroupModule } from "../buttons/modules/button-group/button-group.module";

@NgModule({
    declarations: [FilterMenuComponent],
    imports: [
        CommonModule,
        DropDownListModule,
        TextBoxModule,
        ButtonModule,
        FormsModule,
        NumericTextBoxModule,
        DatePickerModule,
        DateTimePickerModule,
        TimePickerModule,
        ButtonGroupModule
    ],
    exports: [FilterMenuComponent]
})
export class FilterModule {}
