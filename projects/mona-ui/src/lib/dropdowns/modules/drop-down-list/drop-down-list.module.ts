import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DropDownListComponent } from "./components/drop-down-list/drop-down-list.component";
import { DropDownListItemTemplateDirective } from "./directives/drop-down-list-item-template.directive";
import { DropDownListValueTemplateDirective } from "./directives/drop-down-list-value-template.directive";
import { DropDownListGroupTemplateDirective } from "./directives/drop-down-list-group-template.directive";
import { PopupModule } from "../../../popup/popup.module";
import { SharedModule } from "../../../shared/shared.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
    declarations: [
        DropDownListComponent,
        DropDownListItemTemplateDirective,
        DropDownListValueTemplateDirective,
        DropDownListGroupTemplateDirective
    ],
    imports: [CommonModule, PopupModule, SharedModule, FontAwesomeModule],
    exports: [
        DropDownListComponent,
        DropDownListGroupTemplateDirective,
        DropDownListItemTemplateDirective,
        DropDownListValueTemplateDirective
    ]
})
export class DropDownListModule {}
