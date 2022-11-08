import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MenuItemComponent } from "./components/menu-item/menu-item.component";
import { MenuItemTextTemplateDirective } from "./directives/menu-item-text-template.directive";
import { MenuItemIconTemplateDirective } from "./directives/menu-item-icon-template.directive";
import { PopupModule } from "../../../popup/popup.module";

@NgModule({
    declarations: [MenuItemComponent, MenuItemTextTemplateDirective, MenuItemIconTemplateDirective],
    imports: [CommonModule, PopupModule],
    exports: [MenuItemComponent, MenuItemTextTemplateDirective, MenuItemIconTemplateDirective]
})
export class SharedMenuModule {}
