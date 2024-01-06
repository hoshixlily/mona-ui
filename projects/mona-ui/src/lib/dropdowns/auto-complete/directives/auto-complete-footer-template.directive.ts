import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaAutoCompleteFooterTemplate]",
    standalone: true
})
export class AutoCompleteFooterTemplateDirective {
    public constructor() {}
}
