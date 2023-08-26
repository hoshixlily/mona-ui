import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaTabContentTemplate]",
    standalone: true
})
export class TabContentTemplateDirective {
    public constructor() {}
}
