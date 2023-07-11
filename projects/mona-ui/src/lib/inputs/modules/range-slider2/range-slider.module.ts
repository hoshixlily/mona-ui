import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RangeSliderComponent } from "./components/range-slider2/range-slider.component";

@NgModule({
    declarations: [RangeSliderComponent],
    imports: [CommonModule],
    exports: [RangeSliderComponent]
})
export class RangeSliderModule {}
