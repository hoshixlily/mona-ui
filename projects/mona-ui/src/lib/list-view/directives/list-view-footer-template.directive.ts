import { Directive, TemplateRef } from "@angular/core";

@Directive({
    selector: "ng-template[monaListViewFooterTemplate]",
    standalone: true
})
export class ListViewFooterTemplateDirective {
    public constructor(public readonly templateRef: TemplateRef<any>) {}
}
