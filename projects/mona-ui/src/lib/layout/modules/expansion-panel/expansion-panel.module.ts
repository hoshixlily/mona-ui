import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExpansionPanelComponent } from "./components/expansion-panel/expansion-panel.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ExpansionPanelTitleTemplateDirective } from "./directives/expansion-panel-title-template.directive";
import { ExpansionPanelActionsTemplateDirective } from "./directives/expansion-panel-actions-template.directive";

@NgModule({
    declarations: [
        ExpansionPanelComponent,
        ExpansionPanelTitleTemplateDirective,
        ExpansionPanelActionsTemplateDirective
    ],
    imports: [CommonModule, FontAwesomeModule],
    exports: [ExpansionPanelComponent, ExpansionPanelTitleTemplateDirective, ExpansionPanelActionsTemplateDirective]
})
export class ExpansionPanelModule {}
