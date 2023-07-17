import { Component, ContentChild, Input, TemplateRef } from "@angular/core";
import { FieldsetLegendTemplateDirective } from "../../directives/fieldset-legend-template.directive";

@Component({
    selector: "mona-fieldset",
    templateUrl: "./fieldset.component.html",
    styleUrls: ["./fieldset.component.scss"]
})
export class FieldsetComponent {
    @Input()
    public legend: string = "";

    @ContentChild(FieldsetLegendTemplateDirective, { read: TemplateRef })
    public legendTemplate: TemplateRef<any> | null = null;
}
