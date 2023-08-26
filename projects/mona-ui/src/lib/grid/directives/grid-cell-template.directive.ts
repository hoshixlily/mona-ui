import { Directive, TemplateRef } from "@angular/core";

@Directive({
    selector: "ng-template[monaGridCellTemplate]",
    standalone: true
})
export class GridCellTemplateDirective {
    public constructor(public readonly templateRef: TemplateRef<any>) {}
}
