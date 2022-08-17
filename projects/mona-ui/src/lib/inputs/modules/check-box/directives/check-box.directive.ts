import { Directive } from "@angular/core";

@Directive({
    selector: "input[tyoe='checkbox'][monaCheckBox]"
})
export class CheckBoxDirective {
    public constructor() {}
}
