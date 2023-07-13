import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PagerComponent } from "./components/pager/pager.component";
import { ButtonModule } from "../buttons/modules/button/button.module";
import { SlicePipe } from "../pipes/slice.pipe";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NumericTextBoxModule } from "../inputs/modules/numeric-text-box/numeric-text-box.module";
import { DropDownListModule } from "../dropdowns/modules/drop-down-list/drop-down-list.module";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [PagerComponent],
    imports: [
        CommonModule,
        ButtonModule,
        FormsModule,
        SlicePipe,
        FontAwesomeModule,
        NumericTextBoxModule,
        DropDownListModule
    ],
    exports: [PagerComponent]
})
export class PagerModule {}
