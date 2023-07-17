import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TabStripModule } from "./modules/tab-strip/tab-strip.module";
import { ExpansionPanelModule } from "./modules/expansion-panel/expansion-panel.module";
import { SplitterModule } from "./modules/splitter/splitter.module";
import { StepperModule } from "./modules/stepper/stepper.module";
import { FieldsetModule } from "./modules/fieldset/fieldset.module";
import { ScrollViewModule } from "./modules/scroll-view/scroll-view.module";

@NgModule({
    declarations: [],
    imports: [CommonModule],
    exports: [ExpansionPanelModule, FieldsetModule, ScrollViewModule, SplitterModule, StepperModule, TabStripModule]
})
export class LayoutModule {}
