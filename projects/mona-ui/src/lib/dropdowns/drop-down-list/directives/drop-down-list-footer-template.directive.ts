import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaDropDownListFooterTemplate]",
    standalone: true
})
export class DropDownListFooterTemplateDirective {
    public constructor() {}
}
