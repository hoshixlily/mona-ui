import { Directive, TemplateRef } from "@angular/core";

@Directive({
    selector: "ng-template[monaWindowTitleTemplate]",
    standalone: true
})
export class WindowTitleTemplateDirective {
    public constructor(public readonly templateRef: TemplateRef<any>) {}
}
