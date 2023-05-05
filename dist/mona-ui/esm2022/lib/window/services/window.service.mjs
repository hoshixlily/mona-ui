import { forwardRef, Injectable } from "@angular/core";
import { WindowContentComponent } from "../components/window-content/window-content.component";
import { asapScheduler } from "rxjs";
import { WindowRef } from "../models/WindowRef";
import { WindowCloseEvent } from "../models/WindowCloseEvent";
import { WindowReference } from "../models/WindowReference";
import * as i0 from "@angular/core";
import * as i1 from "../../popup/services/popup.service";
export class WindowService {
    constructor(popupService) {
        this.popupService = popupService;
    }
    open(settings) {
        const injectorData = {
            content: settings.content,
            draggable: settings.draggable ?? false,
            focusedElement: settings.focusedElement,
            height: settings.height,
            left: settings.left,
            maxHeight: settings.maxHeight ?? window.innerHeight,
            maxWidth: settings.maxWidth ?? window.innerWidth,
            minHeight: settings.minHeight ?? 50,
            minWidth: settings.minWidth ?? 50,
            windowReference: null,
            preventClose: settings.preventClose,
            resizable: settings.resizable ?? false,
            title: typeof settings.title === "string" ? settings.title : undefined,
            titleTemplate: typeof settings.title === "string" ? undefined : settings.title,
            top: settings.top,
            width: settings.width
        };
        const windowReferenceHolder = {
            windowReference: null
        };
        const windowReferenceOptions = {
            popupRef: null
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
            preventClose: (event) => {
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
        asapScheduler.schedule(() => {
            const element = windowReferenceOptions.popupRef.overlayRef.overlayElement;
            element.classList.add("mona-window");
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
            element.style.top = settings.top ? `${settings.top}px` : `calc(50% - ${element.offsetHeight / 2}px)`;
            element.style.left = settings.left ? `${settings.left}px` : `calc(50% - ${element.offsetWidth / 2}px)`;
            element.classList.remove("mona-window-invisible");
        });
        return windowReferenceHolder.windowReference.windowRef;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowService, deps: [{ token: i1.PopupService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowService, providedIn: "root" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: "root"
                }]
        }], ctorParameters: function () { return [{ type: i1.PopupService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvd2luZG93L3NlcnZpY2VzL3dpbmRvdy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXZELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHVEQUF1RCxDQUFDO0FBRy9GLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDckMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRWhELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzlELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQzs7O0FBTTVELE1BQU0sT0FBTyxhQUFhO0lBQ3RCLFlBQW9DLFlBQTBCO1FBQTFCLGlCQUFZLEdBQVosWUFBWSxDQUFjO0lBQUcsQ0FBQztJQUUzRCxJQUFJLENBQUMsUUFBd0I7UUFDaEMsTUFBTSxZQUFZLEdBQXVCO1lBQ3JDLE9BQU8sRUFBRSxRQUFRLENBQUMsT0FBTztZQUN6QixTQUFTLEVBQUUsUUFBUSxDQUFDLFNBQVMsSUFBSSxLQUFLO1lBQ3RDLGNBQWMsRUFBRSxRQUFRLENBQUMsY0FBYztZQUN2QyxNQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU07WUFDdkIsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJO1lBQ25CLFNBQVMsRUFBRSxRQUFRLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxXQUFXO1lBQ25ELFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxVQUFVO1lBQ2hELFNBQVMsRUFBRSxRQUFRLENBQUMsU0FBUyxJQUFJLEVBQUU7WUFDbkMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRLElB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aW1wb3J0IHsgZm9yd2FyZFJlZiwgSW5qZWN0YWJsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBQb3B1cFNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vcG9wdXAvc2VydmljZXMvcG9wdXAuc2VydmljZVwiO1xuaW1wb3J0IHsgV2luZG93Q29udGVudENvbXBvbmVudCB9IGZyb20gXCIuLi9jb21wb25lbnRzL3dpbmRvdy1jb250ZW50L3dpbmRvdy1jb250ZW50LmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgV2luZG93SW5qZWN0b3JEYXRhIH0gZnJvbSBcIi4uL21vZGVscy9XaW5kb3dJbmplY3RvckRhdGFcIjtcbmltcG9ydCB7IFdpbmRvd1NldHRpbmdzIH0gZnJvbSBcIi4uL21vZGVscy9XaW5kb3dTZXR0aW5nc1wiO1xuaW1wb3J0IHsgYXNhcFNjaGVkdWxlciB9IGZyb20gXCJyeGpzXCI7XG5pbXBvcnQgeyBXaW5kb3dSZWYgfSBmcm9tIFwiLi4vbW9kZWxzL1dpbmRvd1JlZlwiO1xuaW1wb3J0IHsgUG9wdXBDbG9zZUV2ZW50IH0gZnJvbSBcIi4uLy4uL3BvcHVwL21vZGVscy9Qb3B1cENsb3NlRXZlbnRcIjtcbmltcG9ydCB7IFdpbmRvd0Nsb3NlRXZlbnQgfSBmcm9tIFwiLi4vbW9kZWxzL1dpbmRvd0Nsb3NlRXZlbnRcIjtcbmltcG9ydCB7IFdpbmRvd1JlZmVyZW5jZSB9IGZyb20gXCIuLi9tb2RlbHMvV2luZG93UmVmZXJlbmNlXCI7XG5pbXBvcnQgeyBXaW5kb3dSZWZlcmVuY2VPcHRpb25zIH0gZnJvbSBcIi4uL21vZGVscy9XaW5kb3dSZWZlcmVuY2VPcHRpb25zXCI7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiBcInJvb3RcIlxufSlcbmV4cG9ydCBjbGFzcyBXaW5kb3dTZXJ2aWNlIHtcbiAgICBwdWJsaWMgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwb3B1cFNlcnZpY2U6IFBvcHVwU2VydmljZSkge31cblxuICAgIHB1YmxpYyBvcGVuKHNldHRpbmdzOiBXaW5kb3dTZXR0aW5ncyk6IFdpbmRvd1JlZiB7XG4gICAgICAgIGNvbnN0IGluamVjdG9yRGF0YTogV2luZG93SW5qZWN0b3JEYXRhID0ge1xuICAgICAgICAgICAgY29udGVudDogc2V0dGluZ3MuY29udGVudCxcbiAgICAgICAgICAgIGRyYWdnYWJsZTogc2V0dGluZ3MuZHJhZ2dhYmxlID8/IGZhbHNlLFxuICAgICAgICAgICAgZm9jdXNlZEVsZW1lbnQ6IHNldHRpbmdzLmZvY3VzZWRFbGVtZW50LFxuICAgICAgICAgICAgaGVpZ2h0OiBzZXR0aW5ncy5oZWlnaHQsXG4gICAgICAgICAgICBsZWZ0OiBzZXR0aW5ncy5sZWZ0LFxuICAgICAgICAgICAgbWF4SGVpZ2h0OiBzZXR0aW5ncy5tYXhIZWlnaHQgPz8gd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgICAgICAgbWF4V2lkdGg6IHNldHRpbmdzLm1heFdpZHRoID8/IHdpbmRvdy5pbm5lcldpZHRoLFxuICAgICAgICAgICAgbWluSGVpZ2h0OiBzZXR0aW5ncy5taW5IZWlnaHQgPz8gNTAsXG4gICAgICAgICAgICBtaW5XaWR0aDogc2V0dGluZ3MubWluV2lkdGggPz8gNTAsXG4gICAgICAgICAgICB3aW5kb3dSZWZlcmVuY2U6IG51bGwgYXMgYW55LFxuICAgICAgICAgICAgcHJldmVudENsb3NlOiBzZXR0aW5ncy5wcmV2ZW50Q2xvc2UsXG4gICAgICAgICAgICByZXNpemFibGU6IHNldHRpbmdzLnJlc2l6YWJsZSA/PyBmYWxzZSxcbiAgICAgICAgICAgIHRpdGxlOiB0eXBlb2Ygc2V0dGluZ3MudGl0bGUgPT09IFwic3RyaW5nXCIgPyBzZXR0aW5ncy50aXRsZSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHRpdGxlVGVtcGxhdGU6IHR5cGVvZiBzZXR0aW5ncy50aXRsZSA9PT0gXCJzdHJpbmdcIiA/IHVuZGVmaW5lZCA6IHNldHRpbmdzLnRpdGxlLFxuICAgICAgICAgICAgdG9wOiBzZXR0aW5ncy50b3AsXG4gICAgICAgICAgICB3aWR0aDogc2V0dGluZ3Mud2lkdGhcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCB3aW5kb3dSZWZlcmVuY2VIb2xkZXI6IHsgd2luZG93UmVmZXJlbmNlOiBXaW5kb3dSZWZlcmVuY2UgfSA9IHtcbiAgICAgICAgICAgIHdpbmRvd1JlZmVyZW5jZTogbnVsbCBhcyBhbnlcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgd2luZG93UmVmZXJlbmNlT3B0aW9uczogV2luZG93UmVmZXJlbmNlT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHBvcHVwUmVmOiBudWxsIGFzIGFueVxuICAgICAgICB9O1xuICAgICAgICB3aW5kb3dSZWZlcmVuY2VIb2xkZXIud2luZG93UmVmZXJlbmNlID0gbmV3IFdpbmRvd1JlZmVyZW5jZSh3aW5kb3dSZWZlcmVuY2VPcHRpb25zKTtcbiAgICAgICAgaW5qZWN0b3JEYXRhLndpbmRvd1JlZmVyZW5jZSA9IHdpbmRvd1JlZmVyZW5jZUhvbGRlci53aW5kb3dSZWZlcmVuY2U7XG4gICAgICAgIHdpbmRvd1JlZmVyZW5jZU9wdGlvbnMucG9wdXBSZWYgPSB0aGlzLnBvcHVwU2VydmljZS5jcmVhdGUoe1xuICAgICAgICAgICAgYW5jaG9yOiBkb2N1bWVudC5ib2R5LFxuICAgICAgICAgICAgY29udGVudDogV2luZG93Q29udGVudENvbXBvbmVudCxcbiAgICAgICAgICAgIGNsb3NlT25CYWNrZHJvcENsaWNrOiBmYWxzZSxcbiAgICAgICAgICAgIGNsb3NlT25Fc2NhcGU6IHNldHRpbmdzLmNsb3NlT25Fc2NhcGUgPz8gZmFsc2UsXG4gICAgICAgICAgICBjbG9zZU9uT3V0c2lkZUNsaWNrOiBmYWxzZSxcbiAgICAgICAgICAgIGhhc0JhY2tkcm9wOiBzZXR0aW5ncy5tb2RhbCxcbiAgICAgICAgICAgIGJhY2tkcm9wQ2xhc3M6IHNldHRpbmdzLm1vZGFsID8gXCJtb25hLXdpbmRvdy1vdmVybGF5XCIgOiBcInRyYW5zcGFyZW50XCIsXG4gICAgICAgICAgICBwb3B1cENsYXNzOiBbXCJtb25hLXdpbmRvdy1pbnZpc2libGVcIiwgXCJtb25hLXdpbmRvdy1wb3B1cC1jb250ZW50XCJdLFxuICAgICAgICAgICAgcG9zaXRpb25TdHJhdGVneTogXCJnbG9iYWxcIixcbiAgICAgICAgICAgIGRhdGE6IGluamVjdG9yRGF0YSxcbiAgICAgICAgICAgIHdpZHRoOiBzZXR0aW5ncy53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogc2V0dGluZ3MuaGVpZ2h0LFxuICAgICAgICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwcm92aWRlOiBXaW5kb3dSZWYsXG4gICAgICAgICAgICAgICAgICAgIHVzZUZhY3Rvcnk6IGZvcndhcmRSZWYoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvd1JlZmVyZW5jZUhvbGRlci53aW5kb3dSZWZlcmVuY2Uud2luZG93UmVmO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBwcmV2ZW50Q2xvc2U6IChldmVudDogUG9wdXBDbG9zZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLnByZXZlbnRDbG9zZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB3aW5kb3dDbG9zZUV2ZW50ID0gbmV3IFdpbmRvd0Nsb3NlRXZlbnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWE6IGV2ZW50LnZpYSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGV2ZW50LnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IGV2ZW50LnJlc3VsdFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNldHRpbmdzLnByZXZlbnRDbG9zZSh3aW5kb3dDbG9zZUV2ZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYXNhcFNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gd2luZG93UmVmZXJlbmNlT3B0aW9ucy5wb3B1cFJlZi5vdmVybGF5UmVmLm92ZXJsYXlFbGVtZW50O1xuICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwibW9uYS13aW5kb3dcIik7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICAgICAgaWYgKHNldHRpbmdzLm1pbldpZHRoICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLm1pbldpZHRoID0gYCR7c2V0dGluZ3MubWluV2lkdGh9cHhgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNldHRpbmdzLm1pbkhlaWdodCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5taW5IZWlnaHQgPSBgJHtzZXR0aW5ncy5taW5IZWlnaHR9cHhgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNldHRpbmdzLm1heFdpZHRoICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLm1heFdpZHRoID0gYCR7c2V0dGluZ3MubWF4V2lkdGh9cHhgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNldHRpbmdzLm1heEhlaWdodCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5tYXhIZWlnaHQgPSBgJHtzZXR0aW5ncy5tYXhIZWlnaHR9cHhgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50b3AgPSBzZXR0aW5ncy50b3AgPyBgJHtzZXR0aW5ncy50b3B9cHhgIDogYGNhbGMoNTAlIC0gJHtlbGVtZW50Lm9mZnNldEhlaWdodCAvIDJ9cHgpYDtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9IHNldHRpbmdzLmxlZnQgPyBgJHtzZXR0aW5ncy5sZWZ0fXB4YCA6IGBjYWxjKDUwJSAtICR7ZWxlbWVudC5vZmZzZXRXaWR0aCAvIDJ9cHgpYDtcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcIm1vbmEtd2luZG93LWludmlzaWJsZVwiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB3aW5kb3dSZWZlcmVuY2VIb2xkZXIud2luZG93UmVmZXJlbmNlLndpbmRvd1JlZjtcbiAgICB9XG59XG4iXX0=