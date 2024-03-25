import { Directive } from "@angular/core";

@Directive({
    selector: `
        ng-template[monaDropDownNoDataTemplate],
        ng-template[monaAutoCompleteNoDataTemplate],
        ng-template[monaDropDownListNoDataTemplate],
        ng-template[monaDropDownTreeNoDataTemplate],
        ng-template[monaComboBoxNoDataTemplate],
        ng-template[monaMultiSelectNoDataTemplate]
    `,
    standalone: true
})
export class DropDownNoDataTemplateDirective {}
