import { Directive, TemplateRef } from "@angular/core";
import { ListBoxItemTemplateContext } from "../models/ListBoxItemTemplateContext";

@Directive({
    selector: "ng-template[monaListBoxItemTemplate]",
    standalone: true
})
export class ListBoxItemTemplateDirective {}
