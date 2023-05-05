import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NumericTextBoxComponent } from "./components/numeric-text-box/numeric-text-box.component";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ButtonModule } from "../../../buttons/modules/button/button.module";
import { TextBoxModule } from "../text-box/text-box.module";
import * as i0 from "@angular/core";
export class NumericTextBoxModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: NumericTextBoxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: NumericTextBoxModule, declarations: [NumericTextBoxComponent], imports: [CommonModule, FormsModule, FontAwesomeModule, ButtonModule, TextBoxModule], exports: [NumericTextBoxComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: NumericTextBoxModule, imports: [CommonModule, FormsModule, FontAwesomeModule, ButtonModule, TextBoxModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: NumericTextBoxModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [NumericTextBoxComponent],
                    imports: [CommonModule, FormsModule, FontAwesomeModule, ButtonModule, TextBoxModule],
                    exports: [NumericTextBoxComponent]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtZXJpYy10ZXh0LWJveC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvaW5wdXRzL21vZHVsZXMvbnVtZXJpYy10ZXh0LWJveC9udW1lcmljLXRleHQtYm94Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUNuRyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDckUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQzdFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQzs7QUFPMUQsTUFBTSxPQUFPLG9CQUFvQjs4R0FBcEIsb0JBQW9COytHQUFwQixvQkFBb0IsaUJBSmQsdUJBQXVCLGFBQzVCLFlBQVksRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQUUsWUFBWSxFQUFFLGFBQWEsYUFDekUsdUJBQXVCOytHQUV4QixvQkFBb0IsWUFIbkIsWUFBWSxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxZQUFZLEVBQUUsYUFBYTs7MkZBRzFFLG9CQUFvQjtrQkFMaEMsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztvQkFDdkMsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxZQUFZLEVBQUUsYUFBYSxDQUFDO29CQUNwRixPQUFPLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztpQkFDckMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5pbXBvcnQgeyBOdW1lcmljVGV4dEJveENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudHMvbnVtZXJpYy10ZXh0LWJveC9udW1lcmljLXRleHQtYm94LmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7IEZvbnRBd2Vzb21lTW9kdWxlIH0gZnJvbSBcIkBmb3J0YXdlc29tZS9hbmd1bGFyLWZvbnRhd2Vzb21lXCI7XG5pbXBvcnQgeyBCdXR0b25Nb2R1bGUgfSBmcm9tIFwiLi4vLi4vLi4vYnV0dG9ucy9tb2R1bGVzL2J1dHRvbi9idXR0b24ubW9kdWxlXCI7XG5pbXBvcnQge1RleHRCb3hNb2R1bGV9IGZyb20gXCIuLi90ZXh0LWJveC90ZXh0LWJveC5tb2R1bGVcIjtcblxuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtOdW1lcmljVGV4dEJveENvbXBvbmVudF0sXG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgRm9ybXNNb2R1bGUsIEZvbnRBd2Vzb21lTW9kdWxlLCBCdXR0b25Nb2R1bGUsIFRleHRCb3hNb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtOdW1lcmljVGV4dEJveENvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgTnVtZXJpY1RleHRCb3hNb2R1bGUge31cbiJdfQ==