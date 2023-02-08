import { Directive, TemplateRef } from "@angular/core";

@Directive({
    selector: "ng-template[monaWindowTitleTemplate]"
})
export class WindowTitleTemplateDirective {
    public constructor(public readonly templateRef: TemplateRef<void>) {}
}
