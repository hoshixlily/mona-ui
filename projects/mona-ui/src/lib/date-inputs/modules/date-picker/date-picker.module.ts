import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DatePickerComponent } from "./components/date-picker/date-picker.component";
import { SlicePipe } from "../../../pipes/slice.pipe";
import { DateComparerPipe } from "../../../pipes/date-comparer.pipe";
import { TextBoxModule } from "../../../inputs/modules/text-box/text-box.module";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ButtonModule } from "../../../buttons/modules/button/button.module";
import { CalendarModule } from "../calendar/calendar.module";

@NgModule({
    declarations: [DatePickerComponent],
    imports: [
        CommonModule,
        SlicePipe,
        DateComparerPipe,
        TextBoxModule,
        FormsModule,
        FontAwesomeModule,
        ButtonModule,
        CalendarModule
    ],
    exports: [DatePickerComponent]
})
export class DatePickerModule {}
