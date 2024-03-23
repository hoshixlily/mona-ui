import { NgClass } from "@angular/common";
import { Component, input, InputSignal, output, OutputEmitterRef } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ButtonDirective } from "../button/button.directive";

@Component({
    selector: "mona-chip",
    templateUrl: "./chip.component.html",
    styleUrls: ["./chip.component.scss"],
    standalone: true,
    imports: [NgClass, ButtonDirective, FontAwesomeModule],
    host: {
        "[class.mona-chip]": "true",
        "[class.mona-disabled]": "disabled()",
        "[attr.tabindex]": "disabled() ? -1 : tabindex()",
        "[attr.aria-disabled]": "disabled() ? true : undefined"
    }
})
export class ChipComponent {
    protected readonly closeIcon: IconDefinition = faTimes;
    public disabled: InputSignal<boolean> = input(false);
    public label: InputSignal<string> = input("");
    public removable: InputSignal<boolean> = input(false);
    public remove: OutputEmitterRef<Event> = output();
    public tabindex: InputSignal<number | string> = input<number | string>(0);
}
