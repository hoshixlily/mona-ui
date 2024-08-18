import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { ButtonDirective } from "../button/button.directive";

@Component({
    selector: "mona-chip",
    templateUrl: "./chip.component.html",
    styleUrls: ["./chip.component.scss"],
    standalone: true,
    imports: [NgClass, ButtonDirective, FontAwesomeModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        "[class.mona-chip]": "true",
        "[class.mona-disabled]": "disabled()",
        "[attr.tabindex]": "disabled() ? -1 : tabindex()",
        "[attr.aria-disabled]": "disabled() ? true : undefined"
    }
})
export class ChipComponent {
    protected readonly closeIcon = faTimes;
    public disabled = input(false);
    public label = input("");
    public removable = input(false);
    public remove = output<Event>();
    public tabindex = input<number | string>(0);
}
