import { Injectable } from "@angular/core";
import { PopupService } from "../../popup/services/popup.service";
import { WindowContentComponent } from "../components/window-content/window-content.component";
import { WindowInjectorData } from "../models/WindowInjectorData";
import { WindowSettings } from "../models/WindowSettings";
import { asapScheduler } from "rxjs";
import { WindowRef, WindowReference } from "../models/WindowRef";

@Injectable({
    providedIn: "root"
})
export class WindowService {
    public constructor(private readonly popupService: PopupService) {}

    public open(settings: WindowSettings): WindowRef {
        const injectorData: WindowInjectorData = {
            content: settings.content,
            draggable: settings.draggable ?? false,
            focusedElement: settings.focusedElement,
            height: settings.height,
            maxHeight: settings.maxHeight ?? window.innerHeight,
            maxWidth: settings.maxWidth ?? window.innerWidth,
            minHeight: settings.minHeight ?? 50,
            minWidth: settings.minWidth ?? 50,
            windowReference: null as any,
            resizable: settings.resizable ?? false,
            title: typeof settings.title === "string" ? settings.title : undefined,
            titleTemplate: typeof settings.title === "string" ? undefined : settings.title,
            width: settings.width
        };
        const popupRef = this.popupService.create({
            anchor: document.body,
            content: WindowContentComponent,
            closeOnEscape: false,
            closeOnOutsideClick: false,
            hasBackdrop: settings.modal,
            backdropClass: settings.modal ? "mona-window-overlay" : "transparent",
            popupClass: ["mona-window-invisible", "mona-window-popup-content"],
            positionStrategy: "global",
            data: injectorData,
            width: settings.width,
            height: settings.height
        });
        const windowReference: WindowReference = new WindowReference(popupRef);
        injectorData.windowReference = windowReference;
        asapScheduler.schedule(() => {
            const element = popupRef.overlayRef.overlayElement;
            element.classList.add("mona-window");
            element.style.position = "absolute";
            element.style.top = `calc(50% - ${element.offsetHeight / 2}px)`; // center vertically
            element.style.left = `calc(50% - ${element.offsetWidth / 2}px)`; // center horizontally
            element.classList.remove("mona-window-invisible");
        });
        return windowReference.windowRef;
    }
}
