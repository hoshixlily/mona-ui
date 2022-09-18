import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SplitButtonComponent } from "./components/split-button/split-button.component";
import { PopupModule } from "../../../popup/popup.module";
import { ContextMenuModule } from "../../../menus/modules/context-menu/context-menu.module";
import { ButtonModule } from "../button/button.module";
import { SplitButtonTextTemplateDirective } from "./directives/split-button-text-template.directive";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@NgModule({
    declarations: [SplitButtonComponent, SplitButtonTextTemplateDirective],
    imports: [CommonModule, PopupModule, ContextMenuModule, ButtonModule, FontAwesomeModule],
    exports: [SplitButtonComponent, SplitButtonTextTemplateDirective]
})
export class SplitButtonModule {}
