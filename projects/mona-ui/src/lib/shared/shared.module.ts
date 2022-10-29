import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ListGroupTemplateDirective } from "./directives/list-group-template.directive";
import { ListItemTemplateDirective } from "./directives/list-item-template.directive";
import { TypeCastPipe } from "../pipes/type-cast.pipe";

/**
 * Internal use only. Do not export.
 */
@NgModule({
    declarations: [ListGroupTemplateDirective, ListItemTemplateDirective],
    imports: [CommonModule, TypeCastPipe],
    exports: [ListGroupTemplateDirective, ListItemTemplateDirective]
})
export class SharedModule {}
