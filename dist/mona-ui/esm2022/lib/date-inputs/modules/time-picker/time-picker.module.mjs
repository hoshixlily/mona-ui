import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TimePickerComponent } from "./components/time-picker/time-picker.component";
import { TextBoxModule } from "../../../inputs/modules/text-box/text-box.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ButtonModule } from "../../../buttons/modules/button/button.module";
import { FormsModule } from "@angular/forms";
import { ComboBoxModule } from "../../../dropdowns/modules/combo-box/combo-box.module";
import { DropDownListModule } from "../../../dropdowns/modules/drop-down-list/drop-down-list.module";
import { TimeSelectorModule } from "../time-selector/time-selector.module";
import * as i0 from "@angular/core";
export class TimePickerModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TimePickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: TimePickerModule, declarations: [TimePickerComponent], imports: [CommonModule,
            TextBoxModule,
            FontAwesomeModule,
            ButtonModule,
            FormsModule,
            ComboBoxModule,
            DropDownListModule,
            TimeSelectorModule], exports: [TimePickerComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TimePickerModule, imports: [CommonModule,
            TextBoxModule,
            FontAwesomeModule,
            ButtonModule,
            FormsModule,
            ComboBoxModule,
            DropDownListModule,
            TimeSelectorModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TimePickerModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [TimePickerComponent],
                    imports: [
                        CommonModule,
                        TextBoxModule,
                        FontAwesomeModule,
                        ButtonModule,
                        FormsModule,
                        ComboBoxModule,
                        DropDownListModule,
                        TimeSelectorModule
                    ],
                    exports: [TimePickerComponent]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZS1waWNrZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9uYS11aS9zcmMvbGliL2RhdGUtaW5wdXRzL21vZHVsZXMvdGltZS1waWNrZXIvdGltZS1waWNrZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUNqRixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNyRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFDN0UsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx1REFBdUQsQ0FBQztBQUN2RixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxpRUFBaUUsQ0FBQztBQUNyRyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQzs7QUFnQjNFLE1BQU0sT0FBTyxnQkFBZ0I7OEdBQWhCLGdCQUFnQjsrR0FBaEIsZ0JBQWdCLGlCQWJWLG1CQUFtQixhQUU5QixZQUFZO1lBQ1osYUFBYTtZQUNiLGlCQUFpQjtZQUNqQixZQUFZO1lBQ1osV0FBVztZQUNYLGNBQWM7WUFDZCxrQkFBa0I7WUFDbEIsa0JBQWtCLGFBRVosbUJBQW1COytHQUVwQixnQkFBZ0IsWUFYckIsWUFBWTtZQUNaLGFBQWE7WUFDYixpQkFBaUI7WUFDakIsWUFBWTtZQUNaLFdBQVc7WUFDWCxjQUFjO1lBQ2Qsa0JBQWtCO1lBQ2xCLGtCQUFrQjs7MkZBSWIsZ0JBQWdCO2tCQWQ1QixRQUFRO21CQUFDO29CQUNOLFlBQVksRUFBRSxDQUFDLG1CQUFtQixDQUFDO29CQUNuQyxPQUFPLEVBQUU7d0JBQ0wsWUFBWTt3QkFDWixhQUFhO3dCQUNiLGlCQUFpQjt3QkFDakIsWUFBWTt3QkFDWixXQUFXO3dCQUNYLGNBQWM7d0JBQ2Qsa0JBQWtCO3dCQUNsQixrQkFBa0I7cUJBQ3JCO29CQUNELE9BQU8sRUFBRSxDQUFDLG1CQUFtQixDQUFDO2lCQUNqQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcbmltcG9ydCB7IFRpbWVQaWNrZXJDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRzL3RpbWUtcGlja2VyL3RpbWUtcGlja2VyLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgVGV4dEJveE1vZHVsZSB9IGZyb20gXCIuLi8uLi8uLi9pbnB1dHMvbW9kdWxlcy90ZXh0LWJveC90ZXh0LWJveC5tb2R1bGVcIjtcbmltcG9ydCB7IEZvbnRBd2Vzb21lTW9kdWxlIH0gZnJvbSBcIkBmb3J0YXdlc29tZS9hbmd1bGFyLWZvbnRhd2Vzb21lXCI7XG5pbXBvcnQgeyBCdXR0b25Nb2R1bGUgfSBmcm9tIFwiLi4vLi4vLi4vYnV0dG9ucy9tb2R1bGVzL2J1dHRvbi9idXR0b24ubW9kdWxlXCI7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9mb3Jtc1wiO1xuaW1wb3J0IHsgQ29tYm9Cb3hNb2R1bGUgfSBmcm9tIFwiLi4vLi4vLi4vZHJvcGRvd25zL21vZHVsZXMvY29tYm8tYm94L2NvbWJvLWJveC5tb2R1bGVcIjtcbmltcG9ydCB7IERyb3BEb3duTGlzdE1vZHVsZSB9IGZyb20gXCIuLi8uLi8uLi9kcm9wZG93bnMvbW9kdWxlcy9kcm9wLWRvd24tbGlzdC9kcm9wLWRvd24tbGlzdC5tb2R1bGVcIjtcbmltcG9ydCB7IFRpbWVTZWxlY3Rvck1vZHVsZSB9IGZyb20gXCIuLi90aW1lLXNlbGVjdG9yL3RpbWUtc2VsZWN0b3IubW9kdWxlXCI7XG5cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbVGltZVBpY2tlckNvbXBvbmVudF0sXG4gICAgaW1wb3J0czogW1xuICAgICAgICBDb21tb25Nb2R1bGUsXG4gICAgICAgIFRleHRCb3hNb2R1bGUsXG4gICAgICAgIEZvbnRBd2Vzb21lTW9kdWxlLFxuICAgICAgICBCdXR0b25Nb2R1bGUsXG4gICAgICAgIEZvcm1zTW9kdWxlLFxuICAgICAgICBDb21ib0JveE1vZHVsZSxcbiAgICAgICAgRHJvcERvd25MaXN0TW9kdWxlLFxuICAgICAgICBUaW1lU2VsZWN0b3JNb2R1bGVcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtUaW1lUGlja2VyQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBUaW1lUGlja2VyTW9kdWxlIHt9XG4iXX0=