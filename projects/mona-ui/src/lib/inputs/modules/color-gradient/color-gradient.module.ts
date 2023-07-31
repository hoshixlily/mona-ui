import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ColorGradientComponent } from "./components/color-gradient/color-gradient.component";
import { FormsModule } from "@angular/forms";
import { HueSliderComponent } from "./components/hue-slider/hue-slider.component";
import { NumericTextBoxModule } from "../numeric-text-box/numeric-text-box.module";
import { TextBoxModule } from "../text-box/text-box.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ButtonModule } from "../../../buttons/modules/button/button.module";
import { AlphaSliderComponent } from "./components/alpha-slider/alpha-slider.component";
import { ContextMenuModule } from "../../../menus/modules/context-menu/context-menu.module";

@NgModule({
    declarations: [ColorGradientComponent, HueSliderComponent, AlphaSliderComponent],
    imports: [
        CommonModule,
        FormsModule,
        NumericTextBoxModule,
        TextBoxModule,
        FontAwesomeModule,
        ButtonModule,
        ContextMenuModule
    ],
    exports: [ColorGradientComponent]
})
export class ColorGradientModule {}
