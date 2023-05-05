import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DateTimePickerComponent } from "./components/date-time-picker/date-time-picker.component";
import { TextBoxModule } from "../../../inputs/modules/text-box/text-box.module";
import { PopupModule } from "../../../popup/popup.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ButtonModule } from "../../../buttons/modules/button/button.module";
import { FormsModule } from "@angular/forms";
import { SlicePipe } from "../../../pipes/slice.pipe";
import { DateComparerPipe } from "../../../pipes/date-comparer.pipe";
import { ButtonGroupModule } from "../../../buttons/modules/button-group/button-group.module";
import { NumericTextBoxModule } from "../../../inputs/modules/numeric-text-box/numeric-text-box.module";
import { CalendarModule } from "../calendar/calendar.module";
import { TimeSelectorModule } from "../time-selector/time-selector.module";
import * as i0 from "@angular/core";
export class DateTimePickerModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DateTimePickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: DateTimePickerModule, declarations: [DateTimePickerComponent], imports: [CommonModule,
            TextBoxModule,
            PopupModule,
            FontAwesomeModule,
            ButtonModule,
            SlicePipe,
            FormsModule,
            DateComparerPipe,
            ButtonGroupModule,
            NumericTextBoxModule,
            CalendarModule,
            TimeSelectorModule], exports: [DateTimePickerComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DateTimePickerModule, imports: [CommonModule,
            TextBoxModule,
            PopupModule,
            FontAwesomeModule,
            ButtonModule,
            FormsModule,
            ButtonGroupModule,
            NumericTextBoxModule,
            CalendarModule,
            TimeSelectorModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DateTimePickerModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [DateTimePickerComponent],
                    imports: [
                        CommonModule,
                        TextBoxModule,
                        PopupModule,
                        FontAwesomeModule,
                        ButtonModule,
                        SlicePipe,
                        FormsModule,
                        DateComparerPipe,
                        ButtonGroupModule,
                        NumericTextBoxModule,
                        CalendarModule,
                        TimeSelectorModule
                    ],
                    exports: [DateTimePickerComponent]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS10aW1lLXBpY2tlci5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvZGF0ZS1pbnB1dHMvbW9kdWxlcy9kYXRlLXRpbWUtcGlja2VyL2RhdGUtdGltZS1waWNrZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDBEQUEwRCxDQUFDO0FBQ25HLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUNqRixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDckUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQzdFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDdEQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDckUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMkRBQTJELENBQUM7QUFDOUYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sa0VBQWtFLENBQUM7QUFDeEcsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzdELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHVDQUF1QyxDQUFDOztBQW9CM0UsTUFBTSxPQUFPLG9CQUFvQjs4R0FBcEIsb0JBQW9COytHQUFwQixvQkFBb0IsaUJBakJkLHVCQUF1QixhQUVsQyxZQUFZO1lBQ1osYUFBYTtZQUNiLFdBQVc7WUFDWCxpQkFBaUI7WUFDakIsWUFBWTtZQUNaLFNBQVM7WUFDVCxXQUFXO1lBQ1gsZ0JBQWdCO1lBQ2hCLGlCQUFpQjtZQUNqQixvQkFBb0I7WUFDcEIsY0FBYztZQUNkLGtCQUFrQixhQUVaLHVCQUF1QjsrR0FFeEIsb0JBQW9CLFlBZnpCLFlBQVk7WUFDWixhQUFhO1lBQ2IsV0FBVztZQUNYLGlCQUFpQjtZQUNqQixZQUFZO1lBRVosV0FBVztZQUVYLGlCQUFpQjtZQUNqQixvQkFBb0I7WUFDcEIsY0FBYztZQUNkLGtCQUFrQjs7MkZBSWIsb0JBQW9CO2tCQWxCaEMsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztvQkFDdkMsT0FBTyxFQUFFO3dCQUNMLFlBQVk7d0JBQ1osYUFBYTt3QkFDYixXQUFXO3dCQUNYLGlCQUFpQjt3QkFDakIsWUFBWTt3QkFDWixTQUFTO3dCQUNULFdBQVc7d0JBQ1gsZ0JBQWdCO3dCQUNoQixpQkFBaUI7d0JBQ2pCLG9CQUFvQjt3QkFDcEIsY0FBYzt3QkFDZCxrQkFBa0I7cUJBQ3JCO29CQUNELE9BQU8sRUFBRSxDQUFDLHVCQUF1QixDQUFDO2lCQUNyQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcbmltcG9ydCB7IERhdGVUaW1lUGlja2VyQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy9kYXRlLXRpbWUtcGlja2VyL2RhdGUtdGltZS1waWNrZXIuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBUZXh0Qm94TW9kdWxlIH0gZnJvbSBcIi4uLy4uLy4uL2lucHV0cy9tb2R1bGVzL3RleHQtYm94L3RleHQtYm94Lm1vZHVsZVwiO1xuaW1wb3J0IHsgUG9wdXBNb2R1bGUgfSBmcm9tIFwiLi4vLi4vLi4vcG9wdXAvcG9wdXAubW9kdWxlXCI7XG5pbXBvcnQgeyBGb250QXdlc29tZU1vZHVsZSB9IGZyb20gXCJAZm9ydGF3ZXNvbWUvYW5ndWxhci1mb250YXdlc29tZVwiO1xuaW1wb3J0IHsgQnV0dG9uTW9kdWxlIH0gZnJvbSBcIi4uLy4uLy4uL2J1dHRvbnMvbW9kdWxlcy9idXR0b24vYnV0dG9uLm1vZHVsZVwiO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7IFNsaWNlUGlwZSB9IGZyb20gXCIuLi8uLi8uLi9waXBlcy9zbGljZS5waXBlXCI7XG5pbXBvcnQgeyBEYXRlQ29tcGFyZXJQaXBlIH0gZnJvbSBcIi4uLy4uLy4uL3BpcGVzL2RhdGUtY29tcGFyZXIucGlwZVwiO1xuaW1wb3J0IHsgQnV0dG9uR3JvdXBNb2R1bGUgfSBmcm9tIFwiLi4vLi4vLi4vYnV0dG9ucy9tb2R1bGVzL2J1dHRvbi1ncm91cC9idXR0b24tZ3JvdXAubW9kdWxlXCI7XG5pbXBvcnQgeyBOdW1lcmljVGV4dEJveE1vZHVsZSB9IGZyb20gXCIuLi8uLi8uLi9pbnB1dHMvbW9kdWxlcy9udW1lcmljLXRleHQtYm94L251bWVyaWMtdGV4dC1ib3gubW9kdWxlXCI7XG5pbXBvcnQgeyBDYWxlbmRhck1vZHVsZSB9IGZyb20gXCIuLi9jYWxlbmRhci9jYWxlbmRhci5tb2R1bGVcIjtcbmltcG9ydCB7IFRpbWVTZWxlY3Rvck1vZHVsZSB9IGZyb20gXCIuLi90aW1lLXNlbGVjdG9yL3RpbWUtc2VsZWN0b3IubW9kdWxlXCI7XG5cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbRGF0ZVRpbWVQaWNrZXJDb21wb25lbnRdLFxuICAgIGltcG9ydHM6IFtcbiAgICAgICAgQ29tbW9uTW9kdWxlLFxuICAgICAgICBUZXh0Qm94TW9kdWxlLFxuICAgICAgICBQb3B1cE1vZHVsZSxcbiAgICAgICAgRm9udEF3ZXNvbWVNb2R1bGUsXG4gICAgICAgIEJ1dHRvbk1vZHVsZSxcbiAgICAgICAgU2xpY2VQaXBlLFxuICAgICAgICBGb3Jtc01vZHVsZSxcbiAgICAgICAgRGF0ZUNvbXBhcmVyUGlwZSxcbiAgICAgICAgQnV0dG9uR3JvdXBNb2R1bGUsXG4gICAgICAgIE51bWVyaWNUZXh0Qm94TW9kdWxlLFxuICAgICAgICBDYWxlbmRhck1vZHVsZSxcbiAgICAgICAgVGltZVNlbGVjdG9yTW9kdWxlXG4gICAgXSxcbiAgICBleHBvcnRzOiBbRGF0ZVRpbWVQaWNrZXJDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIERhdGVUaW1lUGlja2VyTW9kdWxlIHt9XG4iXX0=