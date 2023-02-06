import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MenubarComponent } from "./components/menubar/menubar.component";
import { MenuComponent } from "./components/menu/menu.component";
import { ContextMenuModule } from "../context-menu/context-menu.module";
import { MenuTextTemplateDirective } from "./directives/menu-text-template.directive";

@NgModule({
    declarations: [MenubarComponent, MenuComponent, MenuTextTemplateDirective],
    imports: [CommonModule, ContextMenuModule],
    exports: [MenubarComponent, MenuComponent, MenuTextTemplateDirective]
})
export class MenubarModule {}
