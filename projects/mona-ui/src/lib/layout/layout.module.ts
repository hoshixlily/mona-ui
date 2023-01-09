import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TabStripModule } from "./modules/tab-strip/tab-strip.module";
import { ExpansionPanelModule } from "./modules/expansion-panel/expansion-panel.module";
import { SplitterModule } from "./modules/splitter/splitter.module";
import { StepperModule } from "./modules/stepper/stepper.module";

@NgModule({
    declarations: [],
    imports: [CommonModule],
    exports: [ExpansionPanelModule, SplitterModule, StepperModule, TabStripModule]
})
export class LayoutModule {}
