import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ColorPickerComponent } from "./components/color-picker/color-picker.component";
import { PopupModule } from "../../../popup/popup.module";
import { ColorPaletteModule } from "../color-palette/color-palette.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import * as i0 from "@angular/core";
export class ColorPickerModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ColorPickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: ColorPickerModule, declarations: [ColorPickerComponent], imports: [CommonModule, PopupModule, ColorPaletteModule, FontAwesomeModule], exports: [ColorPickerComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ColorPickerModule, imports: [CommonModule, PopupModule, ColorPaletteModule, FontAwesomeModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ColorPickerModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ColorPickerComponent],
                    imports: [CommonModule, PopupModule, ColorPaletteModule, FontAwesomeModule],
                    exports: [ColorPickerComponent]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3ItcGlja2VyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9pbnB1dHMvbW9kdWxlcy9jb2xvci1waWNrZXIvY29sb3ItcGlja2VyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUN4RixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDM0UsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7O0FBT3JFLE1BQU0sT0FBTyxpQkFBaUI7OEdBQWpCLGlCQUFpQjsrR0FBakIsaUJBQWlCLGlCQUpYLG9CQUFvQixhQUN6QixZQUFZLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixFQUFFLGlCQUFpQixhQUNoRSxvQkFBb0I7K0dBRXJCLGlCQUFpQixZQUhoQixZQUFZLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixFQUFFLGlCQUFpQjs7MkZBR2pFLGlCQUFpQjtrQkFMN0IsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztvQkFDcEMsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFdBQVcsRUFBRSxrQkFBa0IsRUFBRSxpQkFBaUIsQ0FBQztvQkFDM0UsT0FBTyxFQUFFLENBQUMsb0JBQW9CLENBQUM7aUJBQ2xDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vblwiO1xuaW1wb3J0IHsgQ29sb3JQaWNrZXJDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRzL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXIuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBQb3B1cE1vZHVsZSB9IGZyb20gXCIuLi8uLi8uLi9wb3B1cC9wb3B1cC5tb2R1bGVcIjtcbmltcG9ydCB7IENvbG9yUGFsZXR0ZU1vZHVsZSB9IGZyb20gXCIuLi9jb2xvci1wYWxldHRlL2NvbG9yLXBhbGV0dGUubW9kdWxlXCI7XG5pbXBvcnQgeyBGb250QXdlc29tZU1vZHVsZSB9IGZyb20gXCJAZm9ydGF3ZXNvbWUvYW5ndWxhci1mb250YXdlc29tZVwiO1xuXG5ATmdNb2R1bGUoe1xuICAgIGRlY2xhcmF0aW9uczogW0NvbG9yUGlja2VyQ29tcG9uZW50XSxcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBQb3B1cE1vZHVsZSwgQ29sb3JQYWxldHRlTW9kdWxlLCBGb250QXdlc29tZU1vZHVsZV0sXG4gICAgZXhwb3J0czogW0NvbG9yUGlja2VyQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBDb2xvclBpY2tlck1vZHVsZSB7fVxuIl19