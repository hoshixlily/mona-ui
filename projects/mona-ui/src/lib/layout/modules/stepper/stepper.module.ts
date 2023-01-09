import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StepperComponent } from "./components/stepper/stepper.component";
import { StepperLabelTemplateDirective } from "./directives/stepper-label-template.directive";
import { StepperIndicatorTemplateDirective } from "./directives/stepper-indicator-template.directive";
import { StepperStepTemplateDirective } from "./directives/stepper-step-template.directive";

@NgModule({
    declarations: [
        StepperComponent,
        StepperLabelTemplateDirective,
        StepperIndicatorTemplateDirective,
        StepperStepTemplateDirective
    ],
    imports: [CommonModule],
    exports: [
        StepperComponent,
        StepperIndicatorTemplateDirective,
        StepperLabelTemplateDirective,
        StepperStepTemplateDirective
    ]
})
export class StepperModule {}
