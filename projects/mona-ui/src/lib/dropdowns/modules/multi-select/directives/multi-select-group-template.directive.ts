import { Directive } from "@angular/core";
import { ListGroupTemplateDirective } from "../../../../shared/directives/list-group-template.directive";

@Directive({
    selector: "ng-template[monaMultiSelectGroupTemplate]"
})
export class MultiSelectGroupTemplateDirective extends ListGroupTemplateDirective {
    public constructor() {
        super();
    }
}
