import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WindowContentComponent } from "./components/window-content/window-content.component";
import { ButtonModule } from "../buttons/modules/button/button.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { WindowResizeHandlerDirective } from "./directives/window-resize-handler.directive";
import { WindowDragHandlerDirective } from "./directives/window-drag-handler.directive";
import { WindowComponent } from "./components/window/window.component";
import { WindowTitleTemplateDirective } from "./directives/window-title-template.directive";

@NgModule({
    declarations: [
        WindowContentComponent,
        WindowResizeHandlerDirective,
        WindowDragHandlerDirective,
        WindowComponent,
        WindowTitleTemplateDirective
    ],
    imports: [CommonModule, ButtonModule, FontAwesomeModule],
    exports: [WindowComponent, WindowTitleTemplateDirective]
})
export class WindowModule {}
