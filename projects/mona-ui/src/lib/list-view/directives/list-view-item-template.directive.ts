import { Directive, TemplateRef } from "@angular/core";
import { ListViewItemTemplateContext } from "../models/ListViewItemTemplateContext";

@Directive({
    selector: "ng-template[monaListViewItemTemplate]"
})
export class ListViewItemTemplateDirective {
    public constructor(public readonly templateRef: TemplateRef<ListViewItemTemplateContext>) {}
}
