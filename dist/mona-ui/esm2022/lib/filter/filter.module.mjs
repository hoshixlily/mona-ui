import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FilterMenuComponent } from "./components/filter-menu/filter-menu.component";
import { DropDownListModule } from "../dropdowns/modules/drop-down-list/drop-down-list.module";
import { TextBoxModule } from "../inputs/modules/text-box/text-box.module";
import { ButtonModule } from "../buttons/modules/button/button.module";
import { FormsModule } from "@angular/forms";
import { NumericTextBoxModule } from "../inputs/modules/numeric-text-box/numeric-text-box.module";
import { DatePickerModule } from "../date-inputs/modules/date-picker/date-picker.module";
import { DateTimePickerModule } from "../date-inputs/modules/date-time-picker/date-time-picker.module";
import { TimePickerModule } from "../date-inputs/modules/time-picker/time-picker.module";
import { ButtonGroupModule } from "../buttons/modules/button-group/button-group.module";
import { ValuelessOperatorPipe } from './pipes/valueless-operator.pipe';
import { OperatorFilterPipe } from './pipes/operator-filter.pipe';
import * as i0 from "@angular/core";
export class FilterModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: FilterModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: FilterModule, declarations: [FilterMenuComponent, ValuelessOperatorPipe, OperatorFilterPipe], imports: [CommonModule,
            DropDownListModule,
            TextBoxModule,
            ButtonModule,
            FormsModule,
            NumericTextBoxModule,
            DatePickerModule,
            DateTimePickerModule,
            TimePickerModule,
            ButtonGroupModule], exports: [FilterMenuComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: FilterModule, imports: [CommonModule,
            DropDownListModule,
            TextBoxModule,
            ButtonModule,
            FormsModule,
            NumericTextBoxModule,
            DatePickerModule,
            DateTimePickerModule,
            TimePickerModule,
            ButtonGroupModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: FilterModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [FilterMenuComponent, ValuelessOperatorPipe, OperatorFilterPipe],
                    imports: [
                        CommonModule,
                        DropDownListModule,
                        TextBoxModule,
                        ButtonModule,
                        FormsModule,
                        NumericTextBoxModule,
                        DatePickerModule,
                        DateTimePickerModule,
                        TimePickerModule,
                        ButtonGroupModule
                    ],
                    exports: [FilterMenuComponent]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9maWx0ZXIvZmlsdGVyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQztBQUNyRixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwyREFBMkQsQ0FBQztBQUMvRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDM0UsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUNsRyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx1REFBdUQsQ0FBQztBQUN6RixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxpRUFBaUUsQ0FBQztBQUN2RyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx1REFBdUQsQ0FBQztBQUN6RixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxxREFBcUQsQ0FBQztBQUN4RixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUN4RSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQzs7QUFrQmxFLE1BQU0sT0FBTyxZQUFZOzhHQUFaLFlBQVk7K0dBQVosWUFBWSxpQkFmTixtQkFBbUIsRUFBRSxxQkFBcUIsRUFBRSxrQkFBa0IsYUFFekUsWUFBWTtZQUNaLGtCQUFrQjtZQUNsQixhQUFhO1lBQ2IsWUFBWTtZQUNaLFdBQVc7WUFDWCxvQkFBb0I7WUFDcEIsZ0JBQWdCO1lBQ2hCLG9CQUFvQjtZQUNwQixnQkFBZ0I7WUFDaEIsaUJBQWlCLGFBRVgsbUJBQW1COytHQUVwQixZQUFZLFlBYmpCLFlBQVk7WUFDWixrQkFBa0I7WUFDbEIsYUFBYTtZQUNiLFlBQVk7WUFDWixXQUFXO1lBQ1gsb0JBQW9CO1lBQ3BCLGdCQUFnQjtZQUNoQixvQkFBb0I7WUFDcEIsZ0JBQWdCO1lBQ2hCLGlCQUFpQjs7MkZBSVosWUFBWTtrQkFoQnhCLFFBQVE7bUJBQUM7b0JBQ04sWUFBWSxFQUFFLENBQUMsbUJBQW1CLEVBQUUscUJBQXFCLEVBQUUsa0JBQWtCLENBQUM7b0JBQzlFLE9BQU8sRUFBRTt3QkFDTCxZQUFZO3dCQUNaLGtCQUFrQjt3QkFDbEIsYUFBYTt3QkFDYixZQUFZO3dCQUNaLFdBQVc7d0JBQ1gsb0JBQW9CO3dCQUNwQixnQkFBZ0I7d0JBQ2hCLG9CQUFvQjt3QkFDcEIsZ0JBQWdCO3dCQUNoQixpQkFBaUI7cUJBQ3BCO29CQUNELE9BQU8sRUFBRSxDQUFDLG1CQUFtQixDQUFDO2lCQUNqQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcbmltcG9ydCB7IEZpbHRlck1lbnVDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRzL2ZpbHRlci1tZW51L2ZpbHRlci1tZW51LmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgRHJvcERvd25MaXN0TW9kdWxlIH0gZnJvbSBcIi4uL2Ryb3Bkb3ducy9tb2R1bGVzL2Ryb3AtZG93bi1saXN0L2Ryb3AtZG93bi1saXN0Lm1vZHVsZVwiO1xuaW1wb3J0IHsgVGV4dEJveE1vZHVsZSB9IGZyb20gXCIuLi9pbnB1dHMvbW9kdWxlcy90ZXh0LWJveC90ZXh0LWJveC5tb2R1bGVcIjtcbmltcG9ydCB7IEJ1dHRvbk1vZHVsZSB9IGZyb20gXCIuLi9idXR0b25zL21vZHVsZXMvYnV0dG9uL2J1dHRvbi5tb2R1bGVcIjtcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2Zvcm1zXCI7XG5pbXBvcnQgeyBOdW1lcmljVGV4dEJveE1vZHVsZSB9IGZyb20gXCIuLi9pbnB1dHMvbW9kdWxlcy9udW1lcmljLXRleHQtYm94L251bWVyaWMtdGV4dC1ib3gubW9kdWxlXCI7XG5pbXBvcnQgeyBEYXRlUGlja2VyTW9kdWxlIH0gZnJvbSBcIi4uL2RhdGUtaW5wdXRzL21vZHVsZXMvZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXIubW9kdWxlXCI7XG5pbXBvcnQgeyBEYXRlVGltZVBpY2tlck1vZHVsZSB9IGZyb20gXCIuLi9kYXRlLWlucHV0cy9tb2R1bGVzL2RhdGUtdGltZS1waWNrZXIvZGF0ZS10aW1lLXBpY2tlci5tb2R1bGVcIjtcbmltcG9ydCB7IFRpbWVQaWNrZXJNb2R1bGUgfSBmcm9tIFwiLi4vZGF0ZS1pbnB1dHMvbW9kdWxlcy90aW1lLXBpY2tlci90aW1lLXBpY2tlci5tb2R1bGVcIjtcbmltcG9ydCB7IEJ1dHRvbkdyb3VwTW9kdWxlIH0gZnJvbSBcIi4uL2J1dHRvbnMvbW9kdWxlcy9idXR0b24tZ3JvdXAvYnV0dG9uLWdyb3VwLm1vZHVsZVwiO1xuaW1wb3J0IHsgVmFsdWVsZXNzT3BlcmF0b3JQaXBlIH0gZnJvbSAnLi9waXBlcy92YWx1ZWxlc3Mtb3BlcmF0b3IucGlwZSc7XG5pbXBvcnQgeyBPcGVyYXRvckZpbHRlclBpcGUgfSBmcm9tICcuL3BpcGVzL29wZXJhdG9yLWZpbHRlci5waXBlJztcblxuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtGaWx0ZXJNZW51Q29tcG9uZW50LCBWYWx1ZWxlc3NPcGVyYXRvclBpcGUsIE9wZXJhdG9yRmlsdGVyUGlwZV0sXG4gICAgaW1wb3J0czogW1xuICAgICAgICBDb21tb25Nb2R1bGUsXG4gICAgICAgIERyb3BEb3duTGlzdE1vZHVsZSxcbiAgICAgICAgVGV4dEJveE1vZHVsZSxcbiAgICAgICAgQnV0dG9uTW9kdWxlLFxuICAgICAgICBGb3Jtc01vZHVsZSxcbiAgICAgICAgTnVtZXJpY1RleHRCb3hNb2R1bGUsXG4gICAgICAgIERhdGVQaWNrZXJNb2R1bGUsXG4gICAgICAgIERhdGVUaW1lUGlja2VyTW9kdWxlLFxuICAgICAgICBUaW1lUGlja2VyTW9kdWxlLFxuICAgICAgICBCdXR0b25Hcm91cE1vZHVsZVxuICAgIF0sXG4gICAgZXhwb3J0czogW0ZpbHRlck1lbnVDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIEZpbHRlck1vZHVsZSB7fVxuIl19