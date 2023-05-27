import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChipComponent } from "./components/chip/chip.component";
import {ButtonModule} from "../button/button.module";

@NgModule({
    declarations: [ChipComponent],
    imports: [CommonModule, ButtonModule],
    exports: [ChipComponent]
})
export class ChipModule {}
