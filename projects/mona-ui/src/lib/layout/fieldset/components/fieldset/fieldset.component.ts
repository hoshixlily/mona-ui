import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, ContentChild, input, InputSignal, TemplateRef } from "@angular/core";
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
    public legend: InputSignal<string> = input("");

    @ContentChild(FieldsetLegendTemplateDirective, { read: TemplateRef })
    public legendTemplate: TemplateRef<any> | null = null;
}
