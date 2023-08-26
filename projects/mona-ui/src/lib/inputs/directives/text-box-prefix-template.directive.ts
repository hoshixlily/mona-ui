import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaTextBoxPrefixTemplate]",
    standalone: true
})
export class TextBoxPrefixTemplateDirective {
    public constructor() {}
}
