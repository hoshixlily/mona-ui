import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DropDownListComponent } from "./components/drop-down-list/drop-down-list.component";
import { DropDownListItemComponent } from "./components/drop-down-list-item/drop-down-list-item.component";
import { DropDownListItemTemplateDirective } from "./directives/drop-down-list-item-template.directive";
import { DropDownListValueTemplateDirective } from "./directives/drop-down-list-value-template.directive";
import { DropDownListGroupTemplateDirective } from "./directives/drop-down-list-group-template.directive";

@NgModule({
    declarations: [
        DropDownListComponent,
        DropDownListItemComponent,
        DropDownListItemTemplateDirective,
        DropDownListValueTemplateDirective,
        DropDownListGroupTemplateDirective
    ],
    imports: [CommonModule],
    exports: [
        DropDownListComponent,
        DropDownListGroupTemplateDirective,
        DropDownListItemTemplateDirective,
        DropDownListValueTemplateDirective
    ]
})
export class DropDownListModule {}
