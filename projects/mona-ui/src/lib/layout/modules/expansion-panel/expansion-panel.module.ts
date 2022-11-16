import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExpansionPanelComponent } from "./components/expansion-panel/expansion-panel.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ExpansionPanelTitleTemplateDirective } from "./directives/expansion-panel-title-template.directive";

@NgModule({
    declarations: [ExpansionPanelComponent, ExpansionPanelTitleTemplateDirective],
    imports: [CommonModule, FontAwesomeModule],
    exports: [ExpansionPanelComponent, ExpansionPanelTitleTemplateDirective]
})
export class ExpansionPanelModule {}
