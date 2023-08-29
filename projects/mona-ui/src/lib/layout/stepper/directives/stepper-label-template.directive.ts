import { Directive, TemplateRef } from "@angular/core";
import { StepperTemplateContext } from "../models/StepperTemplateContext";

@Directive({
    selector: "ng-template[monaStepperLabelTemplate]",
    standalone: true
})
export class StepperLabelTemplateDirective {
    public constructor(public readonly templateRef: TemplateRef<StepperTemplateContext>) {}
}
