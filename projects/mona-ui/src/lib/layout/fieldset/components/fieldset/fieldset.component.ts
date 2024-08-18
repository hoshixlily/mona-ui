import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, contentChild, input, TemplateRef } from "@angular/core";
import { FieldsetLegendTemplateDirective } from "../../directives/fieldset-legend-template.directive";

@Component({
    selector: "mona-fieldset",
    templateUrl: "./fieldset.component.html",
    styleUrls: ["./fieldset.component.scss"],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet],
    host: {
        class: "mona-fieldset"
    }
})
export class FieldsetComponent {
    protected readonly legendTemplate = contentChild(FieldsetLegendTemplateDirective, { read: TemplateRef });
    public legend = input("");
}
