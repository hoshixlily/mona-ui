import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector, TemplateRef } from "@angular/core";
import { PopupSettings } from "../models/PopupSettings";
import { Overlay } from "@angular/cdk/overlay";
import { ComponentPortal, TemplatePortal } from "@angular/cdk/portal";
import { PopupAnchorDirective } from "../directives/popup-anchor.directive";
import { PopupRef } from "../models/PopupRef";
import { PopupInjectionToken } from "../models/PopupInjectionToken";
import { DefaultPositions } from "../models/DefaultPositions";
import { take } from "rxjs";

@Injectable()
export class PopupService {
    public static popupAnchorDirective: PopupAnchorDirective;
    private lastPopupRef: PopupRef | null = null;
    public constructor(
        private readonly applicationRef: ApplicationRef,
        private readonly injector: Injector,
        private readonly overlay: Overlay
    ) {}

    public create(settings: PopupSettings): PopupRef {
        const positionStrategy = this.overlay
            .position()
            .flexibleConnectedTo(settings.anchor)
            .withPositions(settings.positions ?? DefaultPositions)
            .withDefaultOffsetX(settings.offset?.horizontal ?? 0)
            .withDefaultOffsetY(settings.offset?.vertical ?? 0)
            .withPush(settings.withPush ?? true);

        const panelClass = settings.popupClass
            ? ["mona-popup-content"].concat(settings.popupClass)
            : "mona-popup-content";

        const overlayRef = this.overlay.create({
            positionStrategy,
            hasBackdrop: settings.hasBackdrop ?? true,
            panelClass,
            backdropClass: "transparent"
        });

        const popupRef = new PopupRef(overlayRef);
        this.lastPopupRef?.close();
        this.lastPopupRef = popupRef;

        const injector = Injector.create({
            parent: this.injector,
            providers: [
                { provide: PopupRef, useValue: popupRef },
                { provide: PopupInjectionToken, useValue: settings }
            ]
        });

        let portal: TemplatePortal | ComponentPortal<void>;
        if (settings.content instanceof TemplateRef) {
            portal = new TemplatePortal(
                settings.content,
                PopupService.popupAnchorDirective.viewContainerRef,
                null,
                injector
            );
        } else {
            portal = new ComponentPortal(
                settings.content,
                PopupService.popupAnchorDirective.viewContainerRef,
                injector
            );
        }
        overlayRef.attach(portal);
        if (settings.hasBackdrop) {
            overlayRef
                .backdropClick()
                .pipe(take(1))
                .subscribe(() => {
                    popupRef.close();
                    this.lastPopupRef = null;
                });
        } else {
            const subscription = overlayRef.outsidePointerEvents().subscribe(event => {
                if (
                    event.type === "click" ||
                    event.type === "mousedown" ||
                    event.type === "dblclick" ||
                    event.type === "contextmenu" ||
                    event.type === "auxclick"
                ) {
                    popupRef.close();
                    this.lastPopupRef = null;
                    subscription.unsubscribe();
                }
            });
        }
        return popupRef;
    }
}
