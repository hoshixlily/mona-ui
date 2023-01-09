import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SplitterComponent } from "./components/splitter/splitter.component";
import { SplitterPaneComponent } from "./components/splitter-pane/splitter-pane.component";
import { SplitterResizerComponent } from "./components/splitter-resizer/splitter-resizer.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
    declarations: [SplitterComponent, SplitterPaneComponent, SplitterResizerComponent],
    imports: [CommonModule, FontAwesomeModule],
    exports: [SplitterComponent, SplitterPaneComponent]
})
export class SplitterModule {}
