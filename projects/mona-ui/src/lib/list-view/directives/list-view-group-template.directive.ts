import { Directive, TemplateRef } from "@angular/core";

@Directive({
    selector: "ng-template[monaListViewGroupTemplate]"
})
export class ListViewGroupTemplateDirective {
    public constructor(private readonly templateRef: TemplateRef<any>) {}
}