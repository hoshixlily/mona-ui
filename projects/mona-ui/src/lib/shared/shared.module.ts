import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ListComponent } from "./components/list/list.component";
import { ListItemComponent } from "./components/list-item/list-item.component";
import { ListGroupTemplateDirective } from "./directives/list-group-template.directive";
import { ListItemTemplateDirective } from "./directives/list-item-template.directive";

/**
 * Internal use only. Do not export.
 */
@NgModule({
    declarations: [ListComponent, ListItemComponent, ListGroupTemplateDirective, ListItemTemplateDirective],
    imports: [CommonModule],
    exports: [ListComponent, ListItemComponent, ListGroupTemplateDirective, ListItemTemplateDirective]
})
export class SharedModule {}
