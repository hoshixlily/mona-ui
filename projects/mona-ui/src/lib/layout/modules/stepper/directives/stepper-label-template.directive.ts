import { Directive, TemplateRef } from "@angular/core";
import { StepperTemplateContext } from "../models/StepperTemplateContext";

@Directive({
    selector: "ng-template[monaStepperLabelTemplate]"
})
export class StepperLabelTemplateDirective {
    public constructor(public readonly templateRef: TemplateRef<StepperTemplateContext>) {}
}
