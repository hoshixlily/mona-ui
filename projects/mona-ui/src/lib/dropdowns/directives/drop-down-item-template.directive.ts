import { Directive } from "@angular/core";

@Directive({
    selector: `
        ng-template[monaDropDownItemTemplate],
        ng-template[monaAutoCompleteItemTemplate],
        ng-template[monaDropDownListItemTemplate],
        ng-template[monaComboBoxItemTemplate],
        ng-template[monaMultiSelectItemTemplate]
    `,
    standalone: true
})
export class DropDownItemTemplateDirective {}
