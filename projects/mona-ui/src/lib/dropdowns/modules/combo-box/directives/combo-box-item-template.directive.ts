import { Directive } from "@angular/core";
import { ListItemTemplateDirective } from "../../../../shared/directives/list-item-template.directive";

@Directive({
    selector: "ng-template[monaComboBoxItemTemplate]"
})
export class ComboBoxItemTemplateDirective extends ListItemTemplateDirective {
    public constructor() {
        super();
    }
}
