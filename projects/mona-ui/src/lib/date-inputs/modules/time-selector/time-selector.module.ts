import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TimeSelectorComponent } from "./components/time-selector/time-selector.component";
import { NumericTextBoxModule } from "../../../inputs/modules/numeric-text-box/numeric-text-box.module";
import { FormsModule } from "@angular/forms";
import { ButtonGroupModule } from "../../../buttons/modules/button-group/button-group.module";
import { ButtonModule } from "../../../buttons/modules/button/button.module";
import { HourSelectorPipe } from './pipes/hour-selector.pipe';

@NgModule({
    declarations: [TimeSelectorComponent, HourSelectorPipe],
    imports: [CommonModule, NumericTextBoxModule, FormsModule, ButtonGroupModule, ButtonModule],
    exports: [TimeSelectorComponent]
})
export class TimeSelectorModule {}
