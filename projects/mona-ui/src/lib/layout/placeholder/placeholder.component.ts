import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "mona-placeholder",
    standalone: true,
    imports: [],
    templateUrl: "./placeholder.component.html",
    styleUrl: "./placeholder.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaceholderComponent {
    @Input()
    public text: string = "";
}
