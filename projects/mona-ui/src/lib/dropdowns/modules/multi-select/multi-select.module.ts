import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MultiSelectComponent } from "./components/multi-select/multi-select.component";
import { TextBoxModule } from "../../../inputs/modules/text-box/text-box.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../../../shared/shared.module";
import { ChipModule } from "../../../buttons/modules/chip/chip.module";

@NgModule({
    declarations: [MultiSelectComponent],
    imports: [CommonModule, TextBoxModule, FontAwesomeModule, FormsModule, SharedModule, ChipModule],
    exports: [MultiSelectComponent]
})
export class MultiSelectModule {}
