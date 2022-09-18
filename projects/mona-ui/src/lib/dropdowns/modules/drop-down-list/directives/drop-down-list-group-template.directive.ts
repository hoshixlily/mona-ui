import { Directive } from "@angular/core";
import { ListGroupTemplateDirective } from "../../../../shared/directives/list-group-template.directive";

@Directive({
    selector: "ng-template[monaDropDownListGroupTemplate]"
})
export class DropDownListGroupTemplateDirective extends ListGroupTemplateDirective {
    public constructor() {
        super();
    }
}
