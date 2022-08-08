import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SplitButtonComponent } from "./components/split-button/split-button.component";
import { PopupModule } from "../../../popup/popup.module";
import { ContextMenuModule } from "../../../menus/modules/context-menu/context-menu.module";

@NgModule({
    declarations: [SplitButtonComponent],
    imports: [CommonModule, PopupModule, ContextMenuModule],
    exports: [SplitButtonComponent]
})
export class SplitButtonModule {}
