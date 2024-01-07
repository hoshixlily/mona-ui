import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaListBoxNoDataTemplate]",
    standalone: true
})
export class ListBoxNoDataTemplateDirective {
    public constructor() {}
}
