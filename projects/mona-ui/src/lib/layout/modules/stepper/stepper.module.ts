import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StepperComponent } from "./components/stepper/stepper.component";
import { StepperLabelTemplateDirective } from "./directives/stepper-label-template.directive";

@NgModule({
    declarations: [StepperComponent, StepperLabelTemplateDirective],
    imports: [CommonModule],
    exports: [StepperComponent, StepperLabelTemplateDirective]
})
export class StepperModule {}
