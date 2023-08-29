import { Directive, TemplateRef } from "@angular/core";
import { CircularProgressBarLabelTemplateContext } from "../models/CircularProgressBarLabelTemplateContext";

@Directive({
    selector: "ng-template[monaCircularProgressBarLabelTemplate]",
    standalone: true
})
export class CircularProgressBarLabelTemplateDirective {
    public constructor(public readonly templateRef: TemplateRef<CircularProgressBarLabelTemplateContext>) {}
}
