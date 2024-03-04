import { NgClass, NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    input,
    InputSignal,
    model,
    ModelSignal,
    TemplateRef
} from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMinus, faPlus, IconDefinition } from "@fortawesome/free-solid-svg-icons";
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
    protected readonly collapseIcon: IconDefinition = faMinus;
    protected readonly expandIcon: IconDefinition = faPlus;

    public expanded: ModelSignal<boolean> = model(false);
    public title: InputSignal<string> = input("");

    @ContentChild(ExpansionPanelActionsTemplateDirective, { read: TemplateRef })
    public actionsTemplate: TemplateRef<any> | null = null;

    @ContentChild(ExpansionPanelTitleTemplateDirective, { read: TemplateRef })
    public titleTemplate: TemplateRef<any> | null = null;
}
