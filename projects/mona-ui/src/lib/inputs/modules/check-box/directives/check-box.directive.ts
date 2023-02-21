import { Directive } from "@angular/core";

@Directive({
    selector: "input[type='checkbox'][monaCheckBox]"
})
export class CheckBoxDirective {
    public constructor() {}
}
