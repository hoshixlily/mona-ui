import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DropDownListComponent } from "./components/drop-down-list/drop-down-list.component";
import { DropDownListItemTemplateDirective } from "./directives/drop-down-list-item-template.directive";
import { DropDownListValueTemplateDirective } from "./directives/drop-down-list-value-template.directive";
import { DropDownListGroupTemplateDirective } from "./directives/drop-down-list-group-template.directive";
import { PopupModule } from "../../../popup/popup.module";
import { SharedModule } from "../../../shared/shared.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TextBoxModule } from "../../../inputs/modules/text-box/text-box.module";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [
        DropDownListComponent,
        DropDownListItemTemplateDirective,
        DropDownListValueTemplateDirective,
        DropDownListGroupTemplateDirective
    ],
    imports: [CommonModule, PopupModule, SharedModule, FontAwesomeModule, TextBoxModule, FormsModule],
    exports: [
        DropDownListComponent,
        DropDownListGroupTemplateDirective,
        DropDownListItemTemplateDirective,
        DropDownListValueTemplateDirective
    ]
})
export class DropDownListModule {}
