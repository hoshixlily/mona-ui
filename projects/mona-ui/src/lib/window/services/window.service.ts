import { forwardRef, Injectable } from "@angular/core";
import { PopupService } from "../../popup/services/popup.service";
import { WindowContentComponent } from "../components/window-content/window-content.component";
import { WindowInjectorData } from "../models/WindowInjectorData";
import { WindowSettings } from "../models/WindowSettings";
import { asapScheduler, filter, take } from "rxjs";
import { WindowRef } from "../models/WindowRef";
import { PopupCloseEvent } from "../../popup/models/PopupCloseEvent";
import { WindowCloseEvent } from "../models/WindowCloseEvent";
import { WindowReference } from "../models/WindowReference";
import { WindowReferenceOptions } from "../models/WindowReferenceOptions";

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
            left: settings.left,
            maxHeight: settings.maxHeight ?? window.innerHeight,
            maxWidth: settings.maxWidth ?? window.innerWidth,
            minHeight: settings.minHeight ?? 50,
            minWidth: settings.minWidth ?? 50,
            windowReference: null as any,
            preventClose: settings.preventClose,
            resizable: settings.resizable ?? false,
            title: typeof settings.title === "string" ? settings.title : undefined,
            titleTemplate: typeof settings.title === "string" ? undefined : settings.title,
            top: settings.top,
            width: settings.width
        };

        const windowReferenceHolder: { windowReference: WindowReference } = {
            windowReference: null as any
        };
        const windowReferenceOptions: WindowReferenceOptions = {
            popupRef: null as any
        };
        windowReferenceHolder.windowReference = new WindowReference(windowReferenceOptions);
        injectorData.windowReference = windowReferenceHolder.windowReference;
        windowReferenceOptions.popupRef = this.popupService.create({
            anchor: document.body,
            content: WindowContentComponent,
            closeOnBackdropClick: false,
            closeOnEscape: settings.closeOnEscape ?? false,
            closeOnOutsideClick: false,
            hasBackdrop: settings.modal,
            backdropClass: settings.modal ? "mona-window-overlay" : "transparent",
            popupClass: ["mona-window-invisible", "mona-window-popup-content"],
            positionStrategy: "global",
            data: injectorData,
            width: settings.width,
            height: settings.height,
            providers: [
                {
                    provide: WindowRef,
                    useFactory: forwardRef(() => {
                        return windowReferenceHolder.windowReference.windowRef;
                    })
                }
            ],
            preventClose: (event: PopupCloseEvent) => {
                if (settings.preventClose) {
                    const windowCloseEvent = new WindowCloseEvent({
                        event,
                        via: event.via,
                        type: event.type,
                        result: event.result
                    });
                    return settings.preventClose(windowCloseEvent);
                }
                return false;
            }
        });
        const component = windowReferenceHolder.windowReference.popupRef.component?.instance as WindowContentComponent;
        if (component) {
            component.isVisible = true;
            component.animationStateChange
                .pipe(
                    filter(e => e.toState === "hidden"),
                    take(1)
                )
                .subscribe(() => {
                    windowReferenceHolder.windowReference.close();
                });
        }

        asapScheduler.schedule(() => {
            const element = windowReferenceOptions.popupRef.overlayRef.overlayElement;
            const windowClassList = !settings.windowClass
                ? []
                : settings.windowClass instanceof Array
                ? settings.windowClass
                : [settings.windowClass];
            element.classList.add("mona-window");
            windowClassList.forEach(c => element.classList.add(c));
            element.style.position = "absolute";
            if (settings.minWidth != null) {
                element.style.minWidth = `${settings.minWidth}px`;
            }
            if (settings.minHeight != null) {
                element.style.minHeight = `${settings.minHeight}px`;
            }
            if (settings.maxWidth != null) {
                element.style.maxWidth = `${settings.maxWidth}px`;
            }
            if (settings.maxHeight != null) {
                element.style.maxHeight = `${settings.maxHeight}px`;
            }
            element.style.top = settings.top
                ? `${settings.top}px`
                : `calc(50% - ${element.getBoundingClientRect().height / 2}px)`;
            element.style.left = settings.left
                ? `${settings.left}px`
                : `calc(50% - ${element.getBoundingClientRect().width / 2}px)`;
            element.classList.remove("mona-window-invisible");
        });
        return windowReferenceHolder.windowReference.windowRef;
    }
}
