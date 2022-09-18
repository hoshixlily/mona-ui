import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SliderComponent } from "./components/slider/slider.component";
import { SliderTickValueTemplateDirective } from "./directives/slider-tick-value-template.directive";
import { RangeSliderComponent } from "./components/range-slider/range-slider.component";

@NgModule({
    declarations: [RangeSliderComponent, SliderComponent, SliderTickValueTemplateDirective],
    imports: [CommonModule],
    exports: [RangeSliderComponent, SliderComponent, SliderTickValueTemplateDirective]
})
export class SliderModule {}
