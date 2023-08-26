import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaMultiSelectGroupTemplate]",
    standalone: true
})
export class MultiSelectGroupTemplateDirective {
    public constructor() {}
}
