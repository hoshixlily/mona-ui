import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaAutoCompleteNoDataTemplate]",
    standalone: true
})
export class AutoCompleteNoDataTemplateDirective {
    public constructor() {}
}
