import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaComboBoxHeaderTemplate]",
    standalone: true
})
export class ComboBoxHeaderTemplateDirective {
    public constructor() {}
}
