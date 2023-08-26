import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaMenuItemIconTemplate]",
    standalone: true
})
export class MenuItemIconTemplateDirective {
    public constructor() {}
}
