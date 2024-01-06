import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaListGroupHeaderTemplate]",
    standalone: true
})
export class ListGroupHeaderTemplateDirective {
    public constructor() {}
}
