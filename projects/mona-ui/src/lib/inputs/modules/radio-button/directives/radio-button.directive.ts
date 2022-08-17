import { Directive } from "@angular/core";

@Directive({
    selector: "input[type='radio'][monaRadioButton]"
})
export class RadioButtonDirective {
    public constructor() {}
}
