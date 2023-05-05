import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { SlicePipe } from "../../../pipes/slice.pipe";
import { DateComparerPipe } from "../../../pipes/date-comparer.pipe";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ButtonModule } from "../../../buttons/modules/button/button.module";
import { DateIncludePipe } from "../../../pipes/date-include.pipe";
import * as i0 from "@angular/core";
export class CalendarModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CalendarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: CalendarModule, declarations: [CalendarComponent], imports: [CommonModule, SlicePipe, DateComparerPipe, FontAwesomeModule, ButtonModule, DateIncludePipe], exports: [CalendarComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CalendarModule, imports: [CommonModule, FontAwesomeModule, ButtonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CalendarModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [CalendarComponent],
                    imports: [CommonModule, SlicePipe, DateComparerPipe, FontAwesomeModule, ButtonModule, DateIncludePipe],
                    exports: [CalendarComponent]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9uYS11aS9zcmMvbGliL2RhdGUtaW5wdXRzL21vZHVsZXMvY2FsZW5kYXIvY2FsZW5kYXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQzdFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNyRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNyRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFDN0UsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGtDQUFrQyxDQUFDOztBQU9uRSxNQUFNLE9BQU8sY0FBYzs4R0FBZCxjQUFjOytHQUFkLGNBQWMsaUJBSlIsaUJBQWlCLGFBQ3RCLFlBQVksRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsaUJBQWlCLEVBQUUsWUFBWSxFQUFFLGVBQWUsYUFDM0YsaUJBQWlCOytHQUVsQixjQUFjLFlBSGIsWUFBWSxFQUErQixpQkFBaUIsRUFBRSxZQUFZOzsyRkFHM0UsY0FBYztrQkFMMUIsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztvQkFDakMsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxZQUFZLEVBQUUsZUFBZSxDQUFDO29CQUN0RyxPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztpQkFDL0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5pbXBvcnQgeyBDYWxlbmRhckNvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudHMvY2FsZW5kYXIvY2FsZW5kYXIuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBTbGljZVBpcGUgfSBmcm9tIFwiLi4vLi4vLi4vcGlwZXMvc2xpY2UucGlwZVwiO1xuaW1wb3J0IHsgRGF0ZUNvbXBhcmVyUGlwZSB9IGZyb20gXCIuLi8uLi8uLi9waXBlcy9kYXRlLWNvbXBhcmVyLnBpcGVcIjtcbmltcG9ydCB7IEZvbnRBd2Vzb21lTW9kdWxlIH0gZnJvbSBcIkBmb3J0YXdlc29tZS9hbmd1bGFyLWZvbnRhd2Vzb21lXCI7XG5pbXBvcnQgeyBCdXR0b25Nb2R1bGUgfSBmcm9tIFwiLi4vLi4vLi4vYnV0dG9ucy9tb2R1bGVzL2J1dHRvbi9idXR0b24ubW9kdWxlXCI7XG5pbXBvcnQgeyBEYXRlSW5jbHVkZVBpcGUgfSBmcm9tIFwiLi4vLi4vLi4vcGlwZXMvZGF0ZS1pbmNsdWRlLnBpcGVcIjtcblxuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtDYWxlbmRhckNvbXBvbmVudF0sXG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgU2xpY2VQaXBlLCBEYXRlQ29tcGFyZXJQaXBlLCBGb250QXdlc29tZU1vZHVsZSwgQnV0dG9uTW9kdWxlLCBEYXRlSW5jbHVkZVBpcGVdLFxuICAgIGV4cG9ydHM6IFtDYWxlbmRhckNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJNb2R1bGUge31cbiJdfQ==