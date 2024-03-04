import { NgClass } from "@angular/common";
import { Component, EventEmitter, input, Input, InputSignal, OnInit, Output } from "@angular/core";
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
        "[class.mona-disabled]": "disabled",
        "[attr.tabindex]": "disabled ? -1 : tabindex",
        "[attr.aria-disabled]": "disabled ? true : undefined"
    }
})
export class ChipComponent {
    protected readonly closeIcon: IconDefinition = faTimes;

    @Input()
    public disabled: boolean = false;

    public label: InputSignal<string> = input("");
    public removable: InputSignal<boolean> = input(false);

    @Output()
    public remove: EventEmitter<Event> = new EventEmitter<Event>();

    public tabindex: InputSignal<number | string> = input<number | string>(0);
}
