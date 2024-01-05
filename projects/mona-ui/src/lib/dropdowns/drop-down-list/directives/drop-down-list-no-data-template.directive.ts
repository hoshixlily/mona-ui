import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaDropDownListNoDataTemplate]",
    standalone: true
})
export class DropDownListNoDataTemplateDirective {
    public constructor() {}
}
