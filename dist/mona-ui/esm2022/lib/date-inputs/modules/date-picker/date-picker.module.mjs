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
import * as i0 from "@angular/core";
export class DatePickerModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DatePickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: DatePickerModule, declarations: [DatePickerComponent], imports: [CommonModule,
            SlicePipe,
            DateComparerPipe,
            TextBoxModule,
            FormsModule,
            FontAwesomeModule,
            ButtonModule,
            CalendarModule], exports: [DatePickerComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DatePickerModule, imports: [CommonModule,
            TextBoxModule,
            FormsModule,
            FontAwesomeModule,
            ButtonModule,
            CalendarModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DatePickerModule, decorators: [{
            type: NgModule,
            args: [{
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
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1waWNrZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9uYS11aS9zcmMvbGliL2RhdGUtaW5wdXRzL21vZHVsZXMvZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNyRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0RBQWtELENBQUM7QUFDakYsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUM3RSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7O0FBZ0I3RCxNQUFNLE9BQU8sZ0JBQWdCOzhHQUFoQixnQkFBZ0I7K0dBQWhCLGdCQUFnQixpQkFiVixtQkFBbUIsYUFFOUIsWUFBWTtZQUNaLFNBQVM7WUFDVCxnQkFBZ0I7WUFDaEIsYUFBYTtZQUNiLFdBQVc7WUFDWCxpQkFBaUI7WUFDakIsWUFBWTtZQUNaLGNBQWMsYUFFUixtQkFBbUI7K0dBRXBCLGdCQUFnQixZQVhyQixZQUFZO1lBR1osYUFBYTtZQUNiLFdBQVc7WUFDWCxpQkFBaUI7WUFDakIsWUFBWTtZQUNaLGNBQWM7OzJGQUlULGdCQUFnQjtrQkFkNUIsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztvQkFDbkMsT0FBTyxFQUFFO3dCQUNMLFlBQVk7d0JBQ1osU0FBUzt3QkFDVCxnQkFBZ0I7d0JBQ2hCLGFBQWE7d0JBQ2IsV0FBVzt3QkFDWCxpQkFBaUI7d0JBQ2pCLFlBQVk7d0JBQ1osY0FBYztxQkFDakI7b0JBQ0QsT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUM7aUJBQ2pDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vblwiO1xuaW1wb3J0IHsgRGF0ZVBpY2tlckNvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudHMvZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXIuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBTbGljZVBpcGUgfSBmcm9tIFwiLi4vLi4vLi4vcGlwZXMvc2xpY2UucGlwZVwiO1xuaW1wb3J0IHsgRGF0ZUNvbXBhcmVyUGlwZSB9IGZyb20gXCIuLi8uLi8uLi9waXBlcy9kYXRlLWNvbXBhcmVyLnBpcGVcIjtcbmltcG9ydCB7IFRleHRCb3hNb2R1bGUgfSBmcm9tIFwiLi4vLi4vLi4vaW5wdXRzL21vZHVsZXMvdGV4dC1ib3gvdGV4dC1ib3gubW9kdWxlXCI7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9mb3Jtc1wiO1xuaW1wb3J0IHsgRm9udEF3ZXNvbWVNb2R1bGUgfSBmcm9tIFwiQGZvcnRhd2Vzb21lL2FuZ3VsYXItZm9udGF3ZXNvbWVcIjtcbmltcG9ydCB7IEJ1dHRvbk1vZHVsZSB9IGZyb20gXCIuLi8uLi8uLi9idXR0b25zL21vZHVsZXMvYnV0dG9uL2J1dHRvbi5tb2R1bGVcIjtcbmltcG9ydCB7IENhbGVuZGFyTW9kdWxlIH0gZnJvbSBcIi4uL2NhbGVuZGFyL2NhbGVuZGFyLm1vZHVsZVwiO1xuXG5ATmdNb2R1bGUoe1xuICAgIGRlY2xhcmF0aW9uczogW0RhdGVQaWNrZXJDb21wb25lbnRdLFxuICAgIGltcG9ydHM6IFtcbiAgICAgICAgQ29tbW9uTW9kdWxlLFxuICAgICAgICBTbGljZVBpcGUsXG4gICAgICAgIERhdGVDb21wYXJlclBpcGUsXG4gICAgICAgIFRleHRCb3hNb2R1bGUsXG4gICAgICAgIEZvcm1zTW9kdWxlLFxuICAgICAgICBGb250QXdlc29tZU1vZHVsZSxcbiAgICAgICAgQnV0dG9uTW9kdWxlLFxuICAgICAgICBDYWxlbmRhck1vZHVsZVxuICAgIF0sXG4gICAgZXhwb3J0czogW0RhdGVQaWNrZXJDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIERhdGVQaWNrZXJNb2R1bGUge31cbiJdfQ==