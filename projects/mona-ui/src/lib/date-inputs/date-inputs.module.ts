import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DateTimePickerModule } from "./modules/date-time-picker/date-time-picker.module";
import { DatePickerModule } from "./modules/date-picker/date-picker.module";
import { CalendarModule } from "./modules/calendar/calendar.module";
import { TimeSelectorModule } from "./modules/time-selector/time-selector.module";
import { TimePickerModule } from "./modules/time-picker/time-picker.module";

@NgModule({
    declarations: [],
    imports: [CommonModule],
    exports: [CalendarModule, DatePickerModule, DateTimePickerModule, TimePickerModule, TimeSelectorModule]
})
export class DateInputsModule {}
