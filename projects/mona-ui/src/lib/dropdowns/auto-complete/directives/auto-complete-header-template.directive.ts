import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaAutoCompleteHeaderTemplate]",
    standalone: true
})
export class AutoCompleteHeaderTemplateDirective {
    public constructor() {}
}
