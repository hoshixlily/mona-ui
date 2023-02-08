import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WindowContentComponent } from "./components/window-content/window-content.component";
import { ButtonModule } from "../buttons/modules/button/button.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { WindowResizeHandlerDirective } from "./directives/window-resize-handler.directive";
import { WindowDragHandlerDirective } from "./directives/window-drag-handler.directive";
import { WindowComponent } from "./components/window/window.component";

@NgModule({
    declarations: [WindowContentComponent, WindowResizeHandlerDirective, WindowDragHandlerDirective, WindowComponent],
    imports: [CommonModule, ButtonModule, FontAwesomeModule],
    exports: [WindowComponent]
})
export class WindowModule {}
