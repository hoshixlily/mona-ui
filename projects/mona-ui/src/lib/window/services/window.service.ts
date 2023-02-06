import { Injectable, TemplateRef } from "@angular/core";
import { PopupService } from "../../popup/services/popup.service";
import { WindowContentComponent } from "../components/window-content/window-content.component";
import { WindowInjectorData } from "../models/WindowInjectorData";

@Injectable({
    providedIn: "root"
})
export class WindowService {
    public constructor(private readonly popupService: PopupService) {}

    public openWindow(content: TemplateRef<void>) {
        const injectorData: WindowInjectorData = {
            content,
            popupRef: null as any
        };
        const popupRef = this.popupService.create({
            anchor: document.body,
            content: WindowContentComponent,
            closeOnEscape: false,
            closeOnOutsideClick: false,
            hasBackdrop: true,
            backdropClass: "mona-window-overlay",
            popupClass: ["mona-window-invisible", "mona-window-popup-content"],
            data: injectorData
        });
        injectorData.popupRef = popupRef;
        window.setTimeout(() => {
            const element = popupRef.overlayRef.overlayElement;
            element.classList.add("mona-window");
            element.style.position = "absolute";
            element.style.top = `calc(50% - ${element.offsetHeight / 2}px)`; // center vertically
            element.style.left = `calc(50% - ${element.offsetWidth / 2}px)`; // center horizontally
            element.classList.remove("mona-window-invisible");
        });
    }
}
