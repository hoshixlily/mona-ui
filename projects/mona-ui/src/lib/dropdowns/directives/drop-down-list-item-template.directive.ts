import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaDropDownListItemTemplate]",
    standalone: true
})
export class DropDownListItemTemplateDirective {
    public constructor() {}
}
