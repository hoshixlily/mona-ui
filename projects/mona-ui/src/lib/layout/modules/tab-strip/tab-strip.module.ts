import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TabStripComponent } from "./components/tab-strip/tab-strip.component";

@NgModule({
    declarations: [TabStripComponent],
    imports: [CommonModule],
    exports: [TabStripComponent]
})
export class TabStripModule {}
