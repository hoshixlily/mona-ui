import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MenubarComponent } from "./components/menubar/menubar.component";
import { MenuComponent } from "./components/menu/menu.component";
import { ContextMenuModule } from "../context-menu/context-menu.module";

@NgModule({
    declarations: [MenubarComponent, MenuComponent],
    imports: [CommonModule, ContextMenuModule],
    exports: [MenubarComponent, MenuComponent]
})
export class MenubarModule {}
