import { Directive, TemplateRef } from "@angular/core";
import { StepperTemplateContext } from "../models/StepperTemplateContext";

@Directive({
    selector: "ng-template[monaStepperIndicatorTemplate]",
    standalone: true
})
export class StepperIndicatorTemplateDirective {
    public constructor(public readonly templateRef: TemplateRef<StepperTemplateContext>) {}
}
