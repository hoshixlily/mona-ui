import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContextMenuComponent } from "./components/context-menu/context-menu.component";
import { PopupModule } from "../../../popup/popup.module";
import { ContextMenuContentComponent } from "./components/context-menu-content/context-menu-content.component";
import { ContextMenuItemComponent } from './components/context-menu-item/context-menu-item.component';

@NgModule({
    declarations: [ContextMenuComponent, ContextMenuContentComponent, ContextMenuItemComponent],
    imports: [CommonModule, PopupModule],
    exports: [ContextMenuComponent]
})
export class ContextMenuModule {}
