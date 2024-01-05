import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaMultiSelectFooterTemplate]",
    standalone: true
})
export class MultiSelectFooterTemplateDirective {
    public constructor() {}
}
