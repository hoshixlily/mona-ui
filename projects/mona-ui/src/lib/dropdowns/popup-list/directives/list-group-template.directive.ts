import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaListGroupTemplate]",
    standalone: true
})
export class ListGroupTemplateDirective {
    public constructor() {}
}
