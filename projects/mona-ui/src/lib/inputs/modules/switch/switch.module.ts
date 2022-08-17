import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SwitchComponent } from "./components/switch/switch.component";
import { SwitchOffLabelTemplateDirective } from "./directives/switch-off-label-template.directive";
import { SwitchOnLabelTemplateDirective } from "./directives/switch-on-label-template.directive";

@NgModule({
    declarations: [SwitchComponent, SwitchOffLabelTemplateDirective, SwitchOnLabelTemplateDirective],
    imports: [CommonModule],
    exports: [SwitchComponent, SwitchOffLabelTemplateDirective, SwitchOnLabelTemplateDirective]
})
export class SwitchModule {}
