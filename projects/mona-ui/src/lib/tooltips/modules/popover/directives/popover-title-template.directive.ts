import { Directive } from "@angular/core";

@Directive({
    selector: "ng-template[monaPopoverTitleTemplate]",
    standalone: true
})
export class PopoverTitleTemplateDirective {
    public constructor() {}
}
