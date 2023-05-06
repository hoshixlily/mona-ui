import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TextBoxModule } from "./modules/text-box/text-box.module";
import { TextAreaModule } from "./modules/text-area/text-area.module";
import { CheckBoxModule } from "./modules/check-box/check-box.module";
import { RadioButtonModule } from "./modules/radio-button/radio-button.module";
import { SwitchModule } from "./modules/switch/switch.module";
import { SliderModule } from "./modules/slider/slider.module";
import { NumericTextBoxModule } from "./modules/numeric-text-box/numeric-text-box.module";
import { ColorPaletteModule } from "./modules/color-palette/color-palette.module";
import { ColorPickerModule } from "./modules/color-picker/color-picker.module";

@NgModule({
    declarations: [],
    imports: [CommonModule],
    exports: [
        CheckBoxModule,
        ColorPaletteModule,
        ColorPickerModule,
        NumericTextBoxModule,
        RadioButtonModule,
        SliderModule,
        SwitchModule,
        TextAreaModule,
        TextBoxModule
    ]
})
export class InputsModule {}