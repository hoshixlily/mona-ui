import { ApplicationRef, Injectable, Injector, NgZone, OnDestroy, Renderer2, TemplateRef } from "@angular/core";
import { PopupSettings } from "../models/PopupSettings";
import { Overlay } from "@angular/cdk/overlay";
import { ComponentPortal, TemplatePortal } from "@angular/cdk/portal";
import { PopupAnchorDirective } from "../directives/popup-anchor.directive";
import { PopupRef } from "../models/PopupRef";
import { PopupInjectionToken } from "../models/PopupInjectionToken";
import { DefaultPositions } from "../models/DefaultPositions";
import { Subject, take, takeUntil } from "rxjs";

@Injectable()
export class PopupService implements OnDestroy {
    public static popupAnchorDirective: PopupAnchorDirective;
    private readonly outsideEventsToClose = ["click", "mousedown", "dblclick", "contextmenu", "auxclick"];
    private readonly serviceDestroy$: Subject<void> = new Subject<void>();
    private lastPopupRef: PopupRef | null = null;

    public constructor(
        private readonly applicationRef: ApplicationRef,
        private readonly injector: Injector,
        private readonly overlay: Overlay,
        private readonly renderer: Renderer2,
        private readonly zone: NgZone
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
            height: settings.height,
            maxHeight: settings.maxHeight,
            maxWidth: settings.maxWidth,
            minHeight: settings.minHeight,
            minWidth: settings.minWidth,
            width: settings.width,
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
            const subscription = overlayRef
                .outsidePointerEvents()
                .pipe(takeUntil(this.serviceDestroy$))
                .subscribe(event => {
                    if (this.outsideEventsToClose.includes(event.type)) {
                        popupRef.close(event);
                        this.lastPopupRef = null;
                        subscription.unsubscribe();
                    }
                });
        }
        this.setEventListeners(settings);
        return popupRef;
    }

    public ngOnDestroy(): void {
        this.serviceDestroy$.next();
        this.serviceDestroy$.complete();
    }

    private setEventListeners(settings: PopupSettings): void {
        this.zone.runOutsideAngular(() => {
            if (settings.closeOnEscape ?? true) {
                const keydownListenerRef = this.renderer.listen(document, "keydown", (event: KeyboardEvent) => {
                    if (event.key === "Escape") {
                        this.zone.run(() => {
                            this.lastPopupRef?.close();
                            this.lastPopupRef = null;
                            keydownListenerRef();
                        });
                    }
                });
            }
        });
    }
}
