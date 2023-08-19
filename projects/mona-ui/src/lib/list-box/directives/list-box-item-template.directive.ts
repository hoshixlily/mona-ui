import { Directive, TemplateRef } from "@angular/core";
import { ListBoxItemTemplateContext } from "../models/ListBoxItemTemplateContext";

@Directive({
    selector: "ng-template[monaListBoxItemTemplate]"
})
export class ListBoxItemTemplateDirective {
    public constructor(private readonly templateRef: TemplateRef<ListBoxItemTemplateContext>) {}
}
