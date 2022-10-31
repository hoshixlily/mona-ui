import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DropDownListComponent } from "./components/drop-down-list/drop-down-list.component";
import { PopupListComponent } from "../../components/popup-list/popup-list.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { DropDownListItemTemplateDirective } from "./directives/drop-down-list-item-template.directive";
import { ListItemTemplateDirective } from "../../directives/list-item-template.directive";
import { DropDownListValueTemplateDirective } from "./directives/drop-down-list-value-template.directive";
import { DropDownListGroupTemplateDirective } from "./directives/drop-down-list-group-template.directive";
import { ListGroupTemplateDirective } from "../../directives/list-group-template.directive";
import { ButtonModule } from "../../../buttons/modules/button/button.module";

@NgModule({
    declarations: [
        DropDownListComponent,
        DropDownListItemTemplateDirective,
        DropDownListValueTemplateDirective,
        DropDownListGroupTemplateDirective
    ],
    imports: [
        CommonModule,
        PopupListComponent,
        FontAwesomeModule,
        ListItemTemplateDirective,
        ListGroupTemplateDirective,
        ButtonModule
    ],
    exports: [
        DropDownListComponent,
        DropDownListItemTemplateDirective,
        DropDownListValueTemplateDirective,
        DropDownListGroupTemplateDirective
    ]
})
export class DropDownListModule {}
