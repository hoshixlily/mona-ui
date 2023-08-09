import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ContextMenuModule } from "../../../menus/modules/context-menu/context-menu.module";
import { ButtonModule } from "../button/button.module";
import { DropDownButtonComponent } from "./components/drop-down-button/drop-down-button.component";

@NgModule({
    declarations: [DropDownButtonComponent],
    imports: [CommonModule, ButtonModule, ContextMenuModule],
    exports: [DropDownButtonComponent]
})
export class DropDownButtonModule {}
