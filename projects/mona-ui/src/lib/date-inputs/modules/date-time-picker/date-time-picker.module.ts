import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DateTimePickerComponent } from "./components/date-time-picker/date-time-picker.component";
import { TextBoxModule } from "../../../inputs/modules/text-box/text-box.module";
import { PopupModule } from "../../../popup/popup.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ButtonModule } from "../../../buttons/modules/button/button.module";
import { MonaUiModule } from "../../../mona-ui.module";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [DateTimePickerComponent],
    imports: [CommonModule, TextBoxModule, PopupModule, FontAwesomeModule, ButtonModule, MonaUiModule, FormsModule],
    exports: [DateTimePickerComponent]
})
export class DateTimePickerModule {}
