import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SliderComponent } from "./components/slider2/slider.component";

@NgModule({
    declarations: [SliderComponent],
    imports: [CommonModule],
    exports: [SliderComponent]
})
export class SliderModule {}
