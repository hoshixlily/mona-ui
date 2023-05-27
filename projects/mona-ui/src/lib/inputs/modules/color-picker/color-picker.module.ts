import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ColorPickerComponent } from "./components/color-picker/color-picker.component";
import { PopupModule } from "../../../popup/popup.module";
import { ColorPaletteModule } from "../color-palette/color-palette.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {ButtonModule} from "../../../buttons/modules/button/button.module";

@NgModule({
    declarations: [ColorPickerComponent],
    imports: [CommonModule, PopupModule, ColorPaletteModule, FontAwesomeModule, ButtonModule],
    exports: [ColorPickerComponent]
})
export class ColorPickerModule {}
