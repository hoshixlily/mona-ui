import { Directive, TemplateRef } from "@angular/core";

@Directive({
    selector: "ng-template[monaListViewGroupHeaderTemplate]",
    standalone: true
})
export class ListViewGroupHeaderTemplateDirective {
    public constructor(private readonly templateRef: TemplateRef<any>) {}
}
