import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WindowContentComponent } from "./components/window-content/window-content.component";
import { ButtonModule } from "../buttons/modules/button/button.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { WindowResizeHandlerDirective } from "./directives/window-resize-handler.directive";
import { WindowDragHandlerDirective } from './directives/window-drag-handler.directive';

@NgModule({
    declarations: [WindowContentComponent, WindowResizeHandlerDirective, WindowDragHandlerDirective],
    imports: [CommonModule, ButtonModule, FontAwesomeModule]
})
export class WindowModule {}
