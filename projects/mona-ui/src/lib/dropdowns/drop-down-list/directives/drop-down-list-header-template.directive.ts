import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaDropDownListHeaderTemplate]",
    standalone: true
})
export class DropDownListHeaderTemplateDirective {
    public constructor() {}
}
