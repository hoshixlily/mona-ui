import { Directive, TemplateRef } from "@angular/core";
import { BreadcrumbItemTemplateContext } from "../models/BreadcrumbItemTemplateContext";

@Directive({
    selector: "ng-template[monaBreadcrumbSeparatorTemplate]"
})
export class BreadcrumbSeparatorTemplateDirective {
    public constructor(public readonly template: TemplateRef<BreadcrumbItemTemplateContext>) {}
}
