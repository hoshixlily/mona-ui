import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContextMenuComponent } from "./components/context-menu/context-menu.component";
import { ContextMenuContentComponent } from "./components/context-menu-content/context-menu-content.component";
import { ContextMenuItemComponent } from "./components/context-menu-item/context-menu-item.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MenuItemComponent } from "../shared-menu/components/menu-item/menu-item.component";
import { SharedMenuModule } from "../shared-menu/shared-menu.module";
import { MenuItemTextTemplateDirective } from "../shared-menu/directives/menu-item-text-template.directive";
import { MenuItemIconTemplateDirective } from "../shared-menu/directives/menu-item-icon-template.directive";

@NgModule({
    declarations: [ContextMenuComponent, ContextMenuContentComponent, ContextMenuItemComponent],
    imports: [CommonModule, FontAwesomeModule, SharedMenuModule],
    exports: [ContextMenuComponent, MenuItemComponent, MenuItemTextTemplateDirective, MenuItemIconTemplateDirective]
})
export class ContextMenuModule {}
