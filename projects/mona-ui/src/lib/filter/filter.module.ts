import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FilterMenuComponent } from "./components/filter-menu/filter-menu.component";
import { DropDownListModule } from "../dropdowns/modules/drop-down-list/drop-down-list.module";
import { TextBoxModule } from "../inputs/modules/text-box/text-box.module";
import { ButtonModule } from "../buttons/modules/button/button.module";
import { FormsModule } from "@angular/forms";
import { NumericTextBoxModule } from "../inputs/modules/numeric-text-box/numeric-text-box.module";

@NgModule({
    declarations: [FilterMenuComponent],
    imports: [CommonModule, DropDownListModule, TextBoxModule, ButtonModule, FormsModule, NumericTextBoxModule],
    exports: [FilterMenuComponent]
})
export class FilterModule {}
