import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MenuItemComponent } from "./components/menu-item/menu-item.component";
import { MenuItemTextTemplateDirective } from "./directives/menu-item-text-template.directive";
import { MenuItemIconTemplateDirective } from "./directives/menu-item-icon-template.directive";

@NgModule({
    declarations: [MenuItemComponent, MenuItemTextTemplateDirective, MenuItemIconTemplateDirective],
    imports: [CommonModule],
    exports: [MenuItemComponent, MenuItemTextTemplateDirective, MenuItemIconTemplateDirective]
})
export class SharedMenuModule {}
