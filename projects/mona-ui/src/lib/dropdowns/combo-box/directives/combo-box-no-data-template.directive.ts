import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaComboBoxNoDataTemplate]",
    standalone: true
})
export class ComboBoxNoDataTemplateDirective {
    public constructor() {}
}
