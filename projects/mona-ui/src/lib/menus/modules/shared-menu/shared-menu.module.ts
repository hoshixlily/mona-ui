import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MenuItemComponent } from "./components/menu-item/menu-item.component";
import { MenuItemTextTemplateDirective } from "./directives/menu-item-text-template.directive";

@NgModule({
    declarations: [MenuItemComponent, MenuItemTextTemplateDirective],
    imports: [CommonModule],
    exports: [MenuItemComponent, MenuItemTextTemplateDirective]
})
export class SharedMenuModule {}
