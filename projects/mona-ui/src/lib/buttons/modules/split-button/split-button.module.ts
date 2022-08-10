import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SplitButtonComponent } from "./components/split-button/split-button.component";
import { PopupModule } from "../../../popup/popup.module";
import { ContextMenuModule } from "../../../menus/modules/context-menu/context-menu.module";
import { ButtonModule } from "../button/button.module";
import { SplitButtonTextTemplateDirective } from "./directives/split-button-text-template.directive";

@NgModule({
    declarations: [SplitButtonComponent, SplitButtonTextTemplateDirective],
    imports: [CommonModule, PopupModule, ContextMenuModule, ButtonModule],
    exports: [SplitButtonComponent, SplitButtonTextTemplateDirective]
})
export class SplitButtonModule {}
