import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ButtonModule } from "../buttons/modules/button/button.module";
import { NumericTextBoxModule } from "../inputs/modules/numeric-text-box/numeric-text-box.module";
import { TextBoxModule } from "../inputs/modules/text-box/text-box.module";
import { DialogContentComponent } from "./components/dialog-content/dialog-content.component";
import { WindowContentComponent } from "./components/window-content/window-content.component";
import { WindowComponent } from "./components/window/window.component";
import { WindowDragHandlerDirective } from "./directives/window-drag-handler.directive";
import { WindowResizeHandlerDirective } from "./directives/window-resize-handler.directive";
import { WindowTitleTemplateDirective } from "./directives/window-title-template.directive";

@NgModule({
    declarations: [
        WindowContentComponent,
        WindowResizeHandlerDirective,
        WindowDragHandlerDirective,
        WindowComponent,
        WindowTitleTemplateDirective,
        DialogContentComponent
    ],
    imports: [CommonModule, FormsModule, ButtonModule, FontAwesomeModule, TextBoxModule, NumericTextBoxModule],
    exports: [WindowComponent, WindowTitleTemplateDirective]
})
export class WindowModule {}
