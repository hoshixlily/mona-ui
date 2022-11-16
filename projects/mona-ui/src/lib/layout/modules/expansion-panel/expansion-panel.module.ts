import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExpansionPanelComponent } from "./components/expansion-panel/expansion-panel.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
    declarations: [ExpansionPanelComponent],
    imports: [CommonModule, FontAwesomeModule],
    exports: [ExpansionPanelComponent]
})
export class ExpansionPanelModule {}
