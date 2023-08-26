import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaMenuItemTextTemplate]",
    standalone: true
})
export class MenuItemTextTemplateDirective {
    public constructor() {}
}
