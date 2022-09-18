import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ColorPickerComponent } from "./components/color-picker/color-picker.component";
import { PopupModule } from "../../../popup/popup.module";
import { ColorPaletteModule } from "../color-palette/color-palette.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
    declarations: [ColorPickerComponent],
    imports: [CommonModule, PopupModule, ColorPaletteModule, FontAwesomeModule],
    exports: [ColorPickerComponent]
})
export class ColorPickerModule {}
