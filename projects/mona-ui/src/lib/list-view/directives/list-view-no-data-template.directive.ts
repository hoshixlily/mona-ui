import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaListViewNoDataTemplate]",
    standalone: true
})
export class ListViewNoDataTemplateDirective {
    public constructor() {}
}
