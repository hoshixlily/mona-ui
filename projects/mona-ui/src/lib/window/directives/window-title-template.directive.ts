import { Directive, inject, TemplateRef } from "@angular/core";

@Directive({
    selector: "ng-template[monaWindowTitleTemplate]",
    standalone: true
})
export class WindowTitleTemplateDirective {
    public readonly templateRef: TemplateRef<any> = inject(TemplateRef);
}
