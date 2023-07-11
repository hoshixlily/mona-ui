import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RangeSliderComponent } from "./components/range-slider/range-slider.component";
import { RangeSliderTickValueTemplateDirective } from "./directives/range-slider-tick-value-template.directive";

@NgModule({
    declarations: [RangeSliderComponent, RangeSliderTickValueTemplateDirective],
    imports: [CommonModule],
    exports: [RangeSliderComponent, RangeSliderTickValueTemplateDirective]
})
export class RangeSliderModule {}
