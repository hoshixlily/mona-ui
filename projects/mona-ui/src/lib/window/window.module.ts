import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WindowContentComponent } from "./components/window-content/window-content.component";
import { ButtonModule } from "../buttons/modules/button/button.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { WindowResizeHandlerDirective } from "./directives/window-resize-handler.directive";
import { WindowDragHandlerDirective } from "./directives/window-drag-handler.directive";
import { WindowComponent } from "./components/window/window.component";
import { WindowTitleTemplateDirective } from "./directives/window-title-template.directive";
import { DialogContentComponent } from "./components/dialog-content/dialog-content.component";
import { TextBoxModule } from "../inputs/modules/text-box/text-box.module";
import { FormsModule } from "@angular/forms";
import { NumericTextBoxModule } from "../inputs/modules/numeric-text-box/numeric-text-box.module";

@NgModule({
    declarations: [
        WindowContentComponent,
        WindowResizeHandlerDirective,
        WindowDragHandlerDirective,
        WindowComponent,
        WindowTitleTemplateDirective,
        DialogContentComponent
    ],
    imports: [CommonModule, ButtonModule, FontAwesomeModule, TextBoxModule, FormsModule, NumericTextBoxModule],
    exports: [WindowComponent, WindowTitleTemplateDirective]
})
export class WindowModule {}
