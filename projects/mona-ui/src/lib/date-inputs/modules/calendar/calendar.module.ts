import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { SlicePipe } from "../../../pipes/slice.pipe";
import { DateComparerPipe } from "../../../pipes/date-comparer.pipe";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ButtonModule } from "../../../buttons/modules/button/button.module";
import { DateIncludePipe } from "../../../pipes/date-include.pipe";

@NgModule({
    declarations: [CalendarComponent],
    imports: [CommonModule, SlicePipe, DateComparerPipe, FontAwesomeModule, ButtonModule, DateIncludePipe],
    exports: [CalendarComponent]
})
export class CalendarModule {}
