import { Directive } from "@angular/core";
import { ListGroupTemplateDirective } from "../../../../shared/directives/list-group-template.directive";

@Directive({
    selector: "ng-template[monaComboBoxGroupTemplate]"
})
export class ComboBoxGroupTemplateDirective extends ListGroupTemplateDirective {
    public constructor() {
        super();
    }
}
