import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
    selector: "mona-placeholder",
    standalone: true,
    templateUrl: "./placeholder.component.html",
    styleUrl: "./placeholder.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: "mona-placeholder"
    }
})
export class PlaceholderComponent {
    public text = input("");
}
