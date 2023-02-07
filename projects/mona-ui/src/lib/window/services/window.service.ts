import { Injectable, TemplateRef } from "@angular/core";
import { PopupService } from "../../popup/services/popup.service";
import { WindowContentComponent } from "../components/window-content/window-content.component";
import { WindowInjectorData } from "../models/WindowInjectorData";
import { WindowSettings } from "../models/WindowSettings";
import { v4 } from "uuid";
import { asapScheduler, take } from "rxjs";
import { WindowRef } from "../models/WindowRef";

@Injectable({
    providedIn: "root"
})
export class WindowService {
    public constructor(private readonly popupService: PopupService) {}

    public open(settings: WindowSettings): WindowRef {
        const injectorData: WindowInjectorData = {
            content: settings.content,
            draggable: settings.draggable ?? false,
            height: settings.height,
            maxHeight: settings.maxHeight ?? window.innerHeight,
            maxWidth: settings.maxWidth ?? window.innerWidth,
            minHeight: settings.minHeight ?? 50,
            minWidth: settings.minWidth ?? 50,
            resizable: settings.resizable ?? false,
            popupRef: null as any,
            width: settings.width
        };
        const popupRef = this.popupService.create({
            anchor: document.body,
            content: WindowContentComponent,
            closeOnEscape: false,
            closeOnOutsideClick: false,
            hasBackdrop: true,
            backdropClass: settings.modal ? "mona-window-overlay" : "transparent",
            popupClass: ["mona-window-invisible", "mona-window-popup-content"],
            positionStrategy: "global",
            data: injectorData,
            width: settings.width,
            height: settings.height
        });
        injectorData.popupRef = popupRef;
        const windowRef: WindowRef = new WindowRef(popupRef);
        asapScheduler.schedule(() => {
            const element = popupRef.overlayRef.overlayElement;
            element.classList.add("mona-window");
            element.style.position = "absolute";
            element.style.top = `calc(50% - ${element.offsetHeight / 2}px)`; // center vertically
            element.style.left = `calc(50% - ${element.offsetWidth / 2}px)`; // center horizontally
            element.classList.remove("mona-window-invisible");
        });
        return windowRef;
    }
}
