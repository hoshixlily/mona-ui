import { Directive, TemplateRef } from "@angular/core";
import { StepperTemplateContext } from "../models/StepperTemplateContext";

@Directive({
    selector: "ng-template[monaStepperStepTemplate]",
    standalone: true
})
export class StepperStepTemplateDirective {
    public constructor(public readonly templateRef: TemplateRef<StepperTemplateContext>) {}
}
