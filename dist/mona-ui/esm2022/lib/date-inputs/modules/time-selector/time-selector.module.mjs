import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TimeSelectorComponent } from "./components/time-selector/time-selector.component";
import { NumericTextBoxModule } from "../../../inputs/modules/numeric-text-box/numeric-text-box.module";
import { FormsModule } from "@angular/forms";
import { ButtonGroupModule } from "../../../buttons/modules/button-group/button-group.module";
import { ButtonModule } from "../../../buttons/modules/button/button.module";
import * as i0 from "@angular/core";
export class TimeSelectorModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TimeSelectorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: TimeSelectorModule, declarations: [TimeSelectorComponent], imports: [CommonModule, NumericTextBoxModule, FormsModule, ButtonGroupModule, ButtonModule], exports: [TimeSelectorComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TimeSelectorModule, imports: [CommonModule, NumericTextBoxModule, FormsModule, ButtonGroupModule, ButtonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TimeSelectorModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [TimeSelectorComponent],
                    imports: [CommonModule, NumericTextBoxModule, FormsModule, ButtonGroupModule, ButtonModule],
                    exports: [TimeSelectorComponent]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZS1zZWxlY3Rvci5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvZGF0ZS1pbnB1dHMvbW9kdWxlcy90aW1lLXNlbGVjdG9yL3RpbWUtc2VsZWN0b3IubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQzNGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGtFQUFrRSxDQUFDO0FBQ3hHLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSwyREFBMkQsQ0FBQztBQUM5RixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sK0NBQStDLENBQUM7O0FBTzdFLE1BQU0sT0FBTyxrQkFBa0I7OEdBQWxCLGtCQUFrQjsrR0FBbEIsa0JBQWtCLGlCQUpaLHFCQUFxQixhQUMxQixZQUFZLEVBQUUsb0JBQW9CLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFFLFlBQVksYUFDaEYscUJBQXFCOytHQUV0QixrQkFBa0IsWUFIakIsWUFBWSxFQUFFLG9CQUFvQixFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxZQUFZOzsyRkFHakYsa0JBQWtCO2tCQUw5QixRQUFRO21CQUFDO29CQUNOLFlBQVksRUFBRSxDQUFDLHFCQUFxQixDQUFDO29CQUNyQyxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsb0JBQW9CLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFFLFlBQVksQ0FBQztvQkFDM0YsT0FBTyxFQUFFLENBQUMscUJBQXFCLENBQUM7aUJBQ25DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vblwiO1xuaW1wb3J0IHsgVGltZVNlbGVjdG9yQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy90aW1lLXNlbGVjdG9yL3RpbWUtc2VsZWN0b3IuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBOdW1lcmljVGV4dEJveE1vZHVsZSB9IGZyb20gXCIuLi8uLi8uLi9pbnB1dHMvbW9kdWxlcy9udW1lcmljLXRleHQtYm94L251bWVyaWMtdGV4dC1ib3gubW9kdWxlXCI7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9mb3Jtc1wiO1xuaW1wb3J0IHsgQnV0dG9uR3JvdXBNb2R1bGUgfSBmcm9tIFwiLi4vLi4vLi4vYnV0dG9ucy9tb2R1bGVzL2J1dHRvbi1ncm91cC9idXR0b24tZ3JvdXAubW9kdWxlXCI7XG5pbXBvcnQgeyBCdXR0b25Nb2R1bGUgfSBmcm9tIFwiLi4vLi4vLi4vYnV0dG9ucy9tb2R1bGVzL2J1dHRvbi9idXR0b24ubW9kdWxlXCI7XG5cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbVGltZVNlbGVjdG9yQ29tcG9uZW50XSxcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBOdW1lcmljVGV4dEJveE1vZHVsZSwgRm9ybXNNb2R1bGUsIEJ1dHRvbkdyb3VwTW9kdWxlLCBCdXR0b25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtUaW1lU2VsZWN0b3JDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIFRpbWVTZWxlY3Rvck1vZHVsZSB7fVxuIl19