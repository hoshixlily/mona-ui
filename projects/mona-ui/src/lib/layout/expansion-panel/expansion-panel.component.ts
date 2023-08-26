import { Component, ContentChild, Input, OnInit, TemplateRef } from "@angular/core";
import { faMinus, faPlus, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ExpansionPanelTitleTemplateDirective } from "../directives/expansion-panel-title-template.directive";
import { ExpansionPanelActionsTemplateDirective } from "../directives/expansion-panel-actions-template.directive";
import { SlideVertical } from "../../animations/models/slide.animation";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgClass, NgIf, NgTemplateOutlet } from "@angular/common";

@Component({
    selector: "mona-expansion-panel",
    templateUrl: "./expansion-panel.component.html",
    styleUrls: ["./expansion-panel.component.scss"],
    animations: [SlideVertical],
    standalone: true,
    imports: [NgClass, NgIf, NgTemplateOutlet, FontAwesomeModule]
})
export class ExpansionPanelComponent implements OnInit {
    public readonly collapseIcon: IconDefinition = faMinus;
    public readonly expandIcon: IconDefinition = faPlus;

    @ContentChild(ExpansionPanelActionsTemplateDirective, { read: TemplateRef })
    public actionsTemplate: TemplateRef<any> | null = null;

    @Input()
    public expanded: boolean = false;

    @Input()
    public title: string = "";

    @ContentChild(ExpansionPanelTitleTemplateDirective, { read: TemplateRef })
    public titleTemplate: TemplateRef<any> | null = null;

    public constructor() {}

    public ngOnInit(): void {}
}
