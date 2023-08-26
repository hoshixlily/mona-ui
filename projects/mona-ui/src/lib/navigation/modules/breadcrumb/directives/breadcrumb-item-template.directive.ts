import { Directive, TemplateRef } from "@angular/core";
import { BreadcrumbItemTemplateContext } from "../models/BreadcrumbItemTemplateContext";

@Directive({
    selector: "ng-template[monaBreadcrumbItemTemplate]",
    standalone: true
})
export class BreadcrumbItemTemplateDirective {
    public constructor(public readonly template: TemplateRef<BreadcrumbItemTemplateContext>) {}
}
