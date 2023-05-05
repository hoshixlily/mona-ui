import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DropDownListModule } from "./modules/drop-down-list/drop-down-list.module";
import { ComboBoxModule } from "./modules/combo-box/combo-box.module";
import { MultiSelectModule } from "./modules/multi-select/multi-select.module";
import { AutoCompleteModule } from "./modules/auto-complete/auto-complete.module";
import * as i0 from "@angular/core";
export class DropDownsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DropDownsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: DropDownsModule, imports: [CommonModule], exports: [AutoCompleteModule, ComboBoxModule, DropDownListModule, MultiSelectModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DropDownsModule, imports: [CommonModule, AutoCompleteModule, ComboBoxModule, DropDownListModule, MultiSelectModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DropDownsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [],
                    imports: [CommonModule],
                    exports: [AutoCompleteModule, ComboBoxModule, DropDownListModule, MultiSelectModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcC1kb3ducy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvZHJvcGRvd25zL2Ryb3AtZG93bnMubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUN0RSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUMvRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQzs7QUFPbEYsTUFBTSxPQUFPLGVBQWU7OEdBQWYsZUFBZTsrR0FBZixlQUFlLFlBSGQsWUFBWSxhQUNaLGtCQUFrQixFQUFFLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxpQkFBaUI7K0dBRTFFLGVBQWUsWUFIZCxZQUFZLEVBQ1osa0JBQWtCLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixFQUFFLGlCQUFpQjs7MkZBRTFFLGVBQWU7a0JBTDNCLFFBQVE7bUJBQUM7b0JBQ04sWUFBWSxFQUFFLEVBQUU7b0JBQ2hCLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsT0FBTyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixFQUFFLGlCQUFpQixDQUFDO2lCQUN2RiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcbmltcG9ydCB7IERyb3BEb3duTGlzdE1vZHVsZSB9IGZyb20gXCIuL21vZHVsZXMvZHJvcC1kb3duLWxpc3QvZHJvcC1kb3duLWxpc3QubW9kdWxlXCI7XG5pbXBvcnQgeyBDb21ib0JveE1vZHVsZSB9IGZyb20gXCIuL21vZHVsZXMvY29tYm8tYm94L2NvbWJvLWJveC5tb2R1bGVcIjtcbmltcG9ydCB7IE11bHRpU2VsZWN0TW9kdWxlIH0gZnJvbSBcIi4vbW9kdWxlcy9tdWx0aS1zZWxlY3QvbXVsdGktc2VsZWN0Lm1vZHVsZVwiO1xuaW1wb3J0IHsgQXV0b0NvbXBsZXRlTW9kdWxlIH0gZnJvbSBcIi4vbW9kdWxlcy9hdXRvLWNvbXBsZXRlL2F1dG8tY29tcGxldGUubW9kdWxlXCI7XG5cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbXSxcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbQXV0b0NvbXBsZXRlTW9kdWxlLCBDb21ib0JveE1vZHVsZSwgRHJvcERvd25MaXN0TW9kdWxlLCBNdWx0aVNlbGVjdE1vZHVsZV1cbn0pXG5leHBvcnQgY2xhc3MgRHJvcERvd25zTW9kdWxlIHt9XG4iXX0=