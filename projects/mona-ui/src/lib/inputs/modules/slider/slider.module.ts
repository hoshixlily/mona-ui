import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SliderComponent } from "./components/slider/slider.component";
import { SliderTickValueTemplateDirective } from "./directives/slider-tick-value-template.directive";

@NgModule({
    declarations: [SliderComponent, SliderTickValueTemplateDirective],
    imports: [CommonModule],
    exports: [SliderComponent, SliderTickValueTemplateDirective]
})
export class SliderModule {}
