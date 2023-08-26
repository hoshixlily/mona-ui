import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaComboBoxItemTemplate]",
    standalone: true
})
export class ComboBoxItemTemplateDirective {
    public constructor() {}
}
