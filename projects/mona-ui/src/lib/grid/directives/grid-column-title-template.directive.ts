import { Directive, TemplateRef } from "@angular/core";

@Directive({
    selector: "[monaGridColumnTitleTemplate]"
})
export class GridColumnTitleTemplateDirective {
    public constructor(public readonly templateRef: TemplateRef<any>) {}
}
