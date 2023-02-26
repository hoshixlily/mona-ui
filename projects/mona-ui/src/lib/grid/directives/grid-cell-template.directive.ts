import { Directive, TemplateRef } from "@angular/core";

@Directive({
    selector: "ng-template[monaGridCellTemplate]"
})
export class GridCellTemplateDirective {
    public constructor(public readonly templateRef: TemplateRef<any>) {}
}
