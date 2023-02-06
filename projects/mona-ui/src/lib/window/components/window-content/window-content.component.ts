import { Component, Inject, OnInit } from "@angular/core";
import { PopupInjectionToken } from "../../../popup/models/PopupInjectionToken";
import { WindowInjectorData } from "../../models/WindowInjectorData";
import { faClose, IconDefinition } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "mona-window-content",
    templateUrl: "./window-content.component.html",
    styleUrls: ["./window-content.component.scss"]
})
export class WindowContentComponent implements OnInit {
    public readonly closeIcon: IconDefinition = faClose;
    public constructor(@Inject(PopupInjectionToken) public windowData: WindowInjectorData) {}

    public ngOnInit(): void {
        console.log(this.windowData);
    }
}
