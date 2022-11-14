import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TabStripComponent } from "./components/tab-strip/tab-strip.component";
import { TabComponent } from "./components/tab/tab.component";
import { TabContentTemplateDirective } from "./directives/tab-content-template.directive";
import { TabTitleTemplateDirective } from "./directives/tab-title-template.directive";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ButtonModule } from "../../../buttons/modules/button/button.module";

@NgModule({
    declarations: [TabStripComponent, TabComponent, TabContentTemplateDirective, TabTitleTemplateDirective],
    imports: [CommonModule, FontAwesomeModule, ButtonModule],
    exports: [TabComponent, TabStripComponent, TabContentTemplateDirective, TabTitleTemplateDirective]
})
export class TabStripModule {}
