import { Directive } from "@angular/core";
import { ListItemTemplateDirective } from "../../../../shared/directives/list-item-template.directive";

@Directive({
    selector: "ng-template[monaDropDownListItemTemplate]"
})
export class DropDownListItemTemplateDirective extends ListItemTemplateDirective {
    public constructor() {
        super();
    }
}
