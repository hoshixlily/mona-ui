import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaNumericTextBoxPrefixTemplate]",
    standalone: true
})
export class NumericTextBoxPrefixTemplateDirective {
    public constructor() {}
}
