import { Directive } from "@angular/core";

@Directive({
    selector: "input[type='checkbox'][monaCheckBox]",
    standalone: true
})
export class CheckBoxDirective {}
