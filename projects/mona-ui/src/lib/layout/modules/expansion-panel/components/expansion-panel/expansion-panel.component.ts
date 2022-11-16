import { Component, Input, OnInit } from "@angular/core";
import { faMinus, faPlus, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { SlideDown, SlideDownHidden } from "../../../../../animations/SlideDownAnimation";

@Component({
    selector: "mona-expansion-panel",
    templateUrl: "./expansion-panel.component.html",
    styleUrls: ["./expansion-panel.component.scss"],
    animations: [SlideDownHidden]
})
export class ExpansionPanelComponent implements OnInit {
    public readonly collapseIcon: IconDefinition = faMinus;
    public readonly expandIcon: IconDefinition = faPlus;

    @Input()
    public expanded: boolean = false;

    @Input()
    public title: string = "";

    public constructor() {}

    public ngOnInit(): void {}
}
