import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaTextBoxSuffixTemplate]",
    standalone: true
})
export class TextBoxSuffixTemplateDirective {
    public constructor() {}
}
