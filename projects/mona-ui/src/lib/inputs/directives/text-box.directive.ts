import { Directive } from "@angular/core";

@Directive({
    selector: "input[monaTextBox]",
    standalone: true
})
export class TextBoxDirective {
    public constructor() {}
}
