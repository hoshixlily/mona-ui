import { Directive, TemplateRef } from "@angular/core";

@Directive({
    selector: "ng-template[monaListViewHeaderTemplate]"
})
export class ListViewHeaderTemplateDirective {
    public constructor(public readonly templateRef: TemplateRef<any>) {}
}
