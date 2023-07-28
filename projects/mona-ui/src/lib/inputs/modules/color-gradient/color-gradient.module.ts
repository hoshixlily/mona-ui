import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ColorGradientComponent } from "./components/color-gradient/color-gradient.component";
import { FormsModule } from "@angular/forms";
import { HueSliderComponent } from "./components/hue-slider/hue-slider.component";

@NgModule({
    declarations: [ColorGradientComponent, HueSliderComponent],
    imports: [CommonModule, FormsModule],
    exports: [ColorGradientComponent]
})
export class ColorGradientModule {}
