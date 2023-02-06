import { ChangeDetectionStrategy, Component, Inject, OnInit, TemplateRef, Type } from "@angular/core";
import { PopupInjectionToken } from "../../../popup/models/PopupInjectionToken";
import { WindowInjectorData } from "../../models/WindowInjectorData";
import { faClose, IconDefinition } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "mona-window-content",
    templateUrl: "./window-content.component.html",
    styleUrls: ["./window-content.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WindowContentComponent implements OnInit {
    public readonly ClassType: Type<unknown> = Type;
    public readonly TemplateRef = TemplateRef;
    public readonly closeIcon: IconDefinition = faClose;
    public readonly contentType: "template" | "component" = "template";
    public constructor(@Inject(PopupInjectionToken) public windowData: WindowInjectorData) {
        if (windowData.content instanceof TemplateRef) {
            this.contentType = "template";
        } else {
            this.contentType = "component";
        }
    }

    public ngOnInit(): void {
        console.log(this.windowData);
    }
}
