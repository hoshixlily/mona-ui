import { Directive } from "@angular/core";
import { ListItemTemplateDirective } from "../../../../shared/directives/list-item-template.directive";

@Directive({
    selector: "ng-template[monaMultiSelectItemTemplate]"
})
export class MultiSelectItemTemplateDirective extends ListItemTemplateDirective {
    public constructor() {
        super();
    }
}
