import { Directive } from "@angular/core";

@Directive({
    selector: "input[type='radio'][monaRadioButton]",
    standalone: true
})
export class RadioButtonDirective {
    public constructor() {}
}
