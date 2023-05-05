import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SliderComponent } from "./components/slider/slider.component";
import { SliderTickValueTemplateDirective } from "./directives/slider-tick-value-template.directive";
import { RangeSliderComponent } from "./components/range-slider/range-slider.component";
import * as i0 from "@angular/core";
export class SliderModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SliderModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: SliderModule, declarations: [RangeSliderComponent, SliderComponent, SliderTickValueTemplateDirective], imports: [CommonModule], exports: [RangeSliderComponent, SliderComponent, SliderTickValueTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SliderModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SliderModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [RangeSliderComponent, SliderComponent, SliderTickValueTemplateDirective],
                    imports: [CommonModule],
                    exports: [RangeSliderComponent, SliderComponent, SliderTickValueTemplateDirective]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9pbnB1dHMvbW9kdWxlcy9zbGlkZXIvc2xpZGVyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDdkUsT0FBTyxFQUFFLGdDQUFnQyxFQUFFLE1BQU0sbURBQW1ELENBQUM7QUFDckcsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sa0RBQWtELENBQUM7O0FBT3hGLE1BQU0sT0FBTyxZQUFZOzhHQUFaLFlBQVk7K0dBQVosWUFBWSxpQkFKTixvQkFBb0IsRUFBRSxlQUFlLEVBQUUsZ0NBQWdDLGFBQzVFLFlBQVksYUFDWixvQkFBb0IsRUFBRSxlQUFlLEVBQUUsZ0NBQWdDOytHQUV4RSxZQUFZLFlBSFgsWUFBWTs7MkZBR2IsWUFBWTtrQkFMeEIsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxlQUFlLEVBQUUsZ0NBQWdDLENBQUM7b0JBQ3ZGLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsT0FBTyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsZUFBZSxFQUFFLGdDQUFnQyxDQUFDO2lCQUNyRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcbmltcG9ydCB7IFNsaWRlckNvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudHMvc2xpZGVyL3NsaWRlci5jb21wb25lbnRcIjtcbmltcG9ydCB7IFNsaWRlclRpY2tWYWx1ZVRlbXBsYXRlRGlyZWN0aXZlIH0gZnJvbSBcIi4vZGlyZWN0aXZlcy9zbGlkZXItdGljay12YWx1ZS10ZW1wbGF0ZS5kaXJlY3RpdmVcIjtcbmltcG9ydCB7IFJhbmdlU2xpZGVyQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy9yYW5nZS1zbGlkZXIvcmFuZ2Utc2xpZGVyLmNvbXBvbmVudFwiO1xuXG5ATmdNb2R1bGUoe1xuICAgIGRlY2xhcmF0aW9uczogW1JhbmdlU2xpZGVyQ29tcG9uZW50LCBTbGlkZXJDb21wb25lbnQsIFNsaWRlclRpY2tWYWx1ZVRlbXBsYXRlRGlyZWN0aXZlXSxcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbUmFuZ2VTbGlkZXJDb21wb25lbnQsIFNsaWRlckNvbXBvbmVudCwgU2xpZGVyVGlja1ZhbHVlVGVtcGxhdGVEaXJlY3RpdmVdXG59KVxuZXhwb3J0IGNsYXNzIFNsaWRlck1vZHVsZSB7fVxuIl19