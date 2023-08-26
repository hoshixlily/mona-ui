import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaDropDownListValueTemplate]",
    standalone: true
})
export class DropDownListValueTemplateDirective {
    public constructor() {}
}
