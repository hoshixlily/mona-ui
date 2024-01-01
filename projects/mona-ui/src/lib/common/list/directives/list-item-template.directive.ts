import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaListItemTemplate]",
    standalone: true
})
export class ListItemTemplateDirective {
    public constructor() {}
}
