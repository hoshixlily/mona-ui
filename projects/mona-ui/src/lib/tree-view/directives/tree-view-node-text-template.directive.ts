import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaTreeViewNodeTextTemplate]",
    standalone: true
})
export class TreeViewNodeTextTemplateDirective {
    public constructor() {}
}
