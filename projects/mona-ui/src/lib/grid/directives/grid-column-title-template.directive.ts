import { Directive, TemplateRef } from "@angular/core";

@Directive({
    selector: "[monaGridColumnTitleTemplate]",
    standalone: true
})
export class GridColumnTitleTemplateDirective {
    public constructor(public readonly templateRef: TemplateRef<any>) {}
}
