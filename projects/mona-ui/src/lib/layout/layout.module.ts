import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TabStripModule } from "./modules/tab-strip/tab-strip.module";
import { ExpansionPanelModule } from "./modules/expansion-panel/expansion-panel.module";

@NgModule({
    declarations: [],
    imports: [CommonModule],
    exports: [ExpansionPanelModule, TabStripModule]
})
export class LayoutModule {}
