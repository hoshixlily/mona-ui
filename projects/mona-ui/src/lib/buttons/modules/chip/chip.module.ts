import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChipComponent } from "./components/chip/chip.component";
import {ButtonModule} from "../button/button.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@NgModule({
    declarations: [ChipComponent],
    imports: [CommonModule, ButtonModule, FontAwesomeModule],
    exports: [ChipComponent]
})
export class ChipModule {}
