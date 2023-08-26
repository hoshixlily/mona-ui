import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaExpansionPanelTitleTemplate]",
    standalone: true
})
export class ExpansionPanelTitleTemplateDirective {
    public constructor() {}
}
