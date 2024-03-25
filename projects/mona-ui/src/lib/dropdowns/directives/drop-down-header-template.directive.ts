import { Directive } from "@angular/core";

@Directive({
    selector: `
        ng-template[monaDropDownHeaderTemplate],
        ng-template[monaAutoCompleteHeaderTemplate],
        ng-template[monaDropDownListHeaderTemplate],
        ng-template[monaDropDownTreeHeaderTemplate],
        ng-template[monaComboBoxHeaderTemplate],
        ng-template[monaMultiSelectHeaderTemplate]
  `,
    standalone: true
})
export class DropDownHeaderTemplateDirective {}
