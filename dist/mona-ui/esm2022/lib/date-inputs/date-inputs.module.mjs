import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DateTimePickerModule } from "./modules/date-time-picker/date-time-picker.module";
import { DatePickerModule } from "./modules/date-picker/date-picker.module";
import { CalendarModule } from "./modules/calendar/calendar.module";
import { TimePickerModule } from "./modules/time-picker/time-picker.module";
import * as i0 from "@angular/core";
export class DateInputsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DateInputsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: DateInputsModule, imports: [CommonModule], exports: [CalendarModule, DatePickerModule, DateTimePickerModule, TimePickerModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DateInputsModule, imports: [CommonModule, CalendarModule, DatePickerModule, DateTimePickerModule, TimePickerModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DateInputsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [],
                    imports: [CommonModule],
                    exports: [CalendarModule, DatePickerModule, DateTimePickerModule, TimePickerModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1pbnB1dHMubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9uYS11aS9zcmMvbGliL2RhdGUtaW5wdXRzL2RhdGUtaW5wdXRzLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUMxRixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUM1RSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDcEUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sMENBQTBDLENBQUM7O0FBTzVFLE1BQU0sT0FBTyxnQkFBZ0I7OEdBQWhCLGdCQUFnQjsrR0FBaEIsZ0JBQWdCLFlBSGYsWUFBWSxhQUNaLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRSxvQkFBb0IsRUFBRSxnQkFBZ0I7K0dBRXpFLGdCQUFnQixZQUhmLFlBQVksRUFDWixjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsb0JBQW9CLEVBQUUsZ0JBQWdCOzsyRkFFekUsZ0JBQWdCO2tCQUw1QixRQUFRO21CQUFDO29CQUNOLFlBQVksRUFBRSxFQUFFO29CQUNoQixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRSxvQkFBb0IsRUFBRSxnQkFBZ0IsQ0FBQztpQkFDdEYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5pbXBvcnQgeyBEYXRlVGltZVBpY2tlck1vZHVsZSB9IGZyb20gXCIuL21vZHVsZXMvZGF0ZS10aW1lLXBpY2tlci9kYXRlLXRpbWUtcGlja2VyLm1vZHVsZVwiO1xuaW1wb3J0IHsgRGF0ZVBpY2tlck1vZHVsZSB9IGZyb20gXCIuL21vZHVsZXMvZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXIubW9kdWxlXCI7XG5pbXBvcnQgeyBDYWxlbmRhck1vZHVsZSB9IGZyb20gXCIuL21vZHVsZXMvY2FsZW5kYXIvY2FsZW5kYXIubW9kdWxlXCI7XG5pbXBvcnQgeyBUaW1lUGlja2VyTW9kdWxlIH0gZnJvbSBcIi4vbW9kdWxlcy90aW1lLXBpY2tlci90aW1lLXBpY2tlci5tb2R1bGVcIjtcblxuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtdLFxuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtDYWxlbmRhck1vZHVsZSwgRGF0ZVBpY2tlck1vZHVsZSwgRGF0ZVRpbWVQaWNrZXJNb2R1bGUsIFRpbWVQaWNrZXJNb2R1bGVdXG59KVxuZXhwb3J0IGNsYXNzIERhdGVJbnB1dHNNb2R1bGUge31cbiJdfQ==