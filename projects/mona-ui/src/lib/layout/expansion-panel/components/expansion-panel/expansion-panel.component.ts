import { NgClass, NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, contentChild, input, model, TemplateRef } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { SlideVertical } from "../../../../animations/models/slide.animation";
import { ExpansionPanelActionsTemplateDirective } from "../../directives/expansion-panel-actions-template.directive";
import { ExpansionPanelTitleTemplateDirective } from "../../directives/expansion-panel-title-template.directive";

@Component({
    selector: "mona-expansion-panel",
    templateUrl: "./expansion-panel.component.html",
    styleUrls: ["./expansion-panel.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [SlideVertical],
    standalone: true,
    imports: [NgClass, NgTemplateOutlet, FontAwesomeModule],
    host: {
        class: "mona-expansion-panel",
        "[class.collapsed]": "!expanded()"
    }
})
export class ExpansionPanelComponent {
    protected readonly actionsTemplate = contentChild(ExpansionPanelActionsTemplateDirective, { read: TemplateRef });
    protected readonly collapseIcon = faMinus;
    protected readonly expandIcon = faPlus;
    protected readonly titleTemplate = contentChild(ExpansionPanelTitleTemplateDirective, { read: TemplateRef });

    public expanded = model(false);
    public title = input("");
}
