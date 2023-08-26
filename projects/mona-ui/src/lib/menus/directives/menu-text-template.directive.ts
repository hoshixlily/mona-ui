import { Directive, TemplateRef } from "@angular/core";
import { MenuTextTemplateContext } from "../models/MenuTextTemplateContext";

@Directive({
    selector: "ng-template[monaMenuTextTemplate]",
    standalone: true
})
export class MenuTextTemplateDirective {
    public constructor(public readonly templateRef: TemplateRef<MenuTextTemplateContext<unknown>>) {}
}
