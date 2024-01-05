import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaAutoCompleteItemTemplate]",
    standalone: true
})
export class AutoCompleteItemTemplateDirective {
    public constructor() {}
}
