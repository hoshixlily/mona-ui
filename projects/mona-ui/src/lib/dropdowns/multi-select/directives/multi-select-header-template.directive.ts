import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaMultiSelectHeaderTemplate]",
    standalone: true
})
export class MultiSelectHeaderTemplateDirective {
    public constructor() {}
}
