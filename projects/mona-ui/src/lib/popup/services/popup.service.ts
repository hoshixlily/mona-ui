import { Injectable, Injector, NgZone, OnDestroy, Renderer2, RendererFactory2, TemplateRef } from "@angular/core";
import { PopupSettings } from "../models/PopupSettings";
import { Overlay } from "@angular/cdk/overlay";
import { ComponentPortal, TemplatePortal } from "@angular/cdk/portal";
import { PopupAnchorDirective } from "../directives/popup-anchor.directive";
import { PopupRef } from "../models/PopupRef";
import { PopupInjectionToken } from "../models/PopupInjectionToken";
import { DefaultPositions } from "../models/DefaultPositions";
import { Subject, take, takeUntil } from "rxjs";
import { PopupCloseEvent } from "../models/PopupCloseEvent";

@Injectable({
    providedIn: "root"
})
export class PopupService implements OnDestroy {
    public static popupAnchorDirective: PopupAnchorDirective;
    private readonly outsideEventsToClose = ["click", "mousedown", "dblclick", "contextmenu", "auxclick"];
    private readonly serviceDestroy$: Subject<void> = new Subject<void>();
    private lastPopupRef: PopupRef | null = null;
    private renderer: Renderer2;

    public constructor(
        private readonly injector: Injector,
        private readonly overlay: Overlay,
        private readonly rendererFactory: RendererFactory2,
        private readonly zone: NgZone
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    public create(settings: PopupSettings): PopupRef {
        const preventClose = settings.preventClose ?? null;
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
        this.lastPopupRef = popupRef;

        const injector = Injector.create({
            parent: this.injector,
            providers: [
                { provide: PopupRef, useValue: popupRef },
                { provide: PopupInjectionToken, useValue: settings.data }
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
            const backdropSubject: Subject<void> = new Subject<void>();
            const subscription = overlayRef
                .backdropClick()
                .pipe(takeUntil(backdropSubject))
                .subscribe(e => {
                    const event = new PopupCloseEvent({ event: e, via: "backdropClick" });
                    const prevented = preventClose ? preventClose(event) || event.isDefaultPrevented() : false;
                    if (!prevented) {
                        popupRef.close();
                        this.lastPopupRef = null;
                        backdropSubject.next();
                        backdropSubject.complete();
                    }
                });
            popupRef.closed.pipe(take(1)).subscribe(() => subscription.unsubscribe());
        } else {
            if (settings.closeOnOutsideClick ?? true) {
                const subscription = overlayRef
                    .outsidePointerEvents()
                    .pipe(takeUntil(this.serviceDestroy$))
                    .subscribe(event => {
                        if (this.outsideEventsToClose.includes(event.type)) {
                            const closeEvent = new PopupCloseEvent({ event, via: "outsideClick" });
                            const prevented = preventClose
                                ? preventClose(closeEvent) || closeEvent.isDefaultPrevented()
                                : false;
                            if (!prevented) {
                                popupRef.close();
                                this.lastPopupRef = null;
                                subscription.unsubscribe();
                            }
                        }
                    });
                popupRef.closed.pipe(take(1)).subscribe(() => subscription.unsubscribe());
            }
        }
        this.setEventListeners(settings);
        return popupRef;
    }

    public ngOnDestroy(): void {
        this.serviceDestroy$.next();
        this.serviceDestroy$.complete();
    }

    private setEventListeners(settings: PopupSettings): void {
        let keydownListenerRef: () => void;
        this.zone.runOutsideAngular(() => {
            if (settings.closeOnEscape ?? true) {
                keydownListenerRef = this.renderer.listen(document, "keydown", (event: KeyboardEvent) => {
                    if (event.key === "Escape") {
                        const closeEvent = new PopupCloseEvent({ event, via: "escape" });
                        const prevented = settings.preventClose
                            ? settings.preventClose(closeEvent) || closeEvent.isDefaultPrevented()
                            : false;
                        if (!prevented) {
                            this.zone.run(() => {
                                this.lastPopupRef?.close();
                                this.lastPopupRef = null;
                                keydownListenerRef();
                            });
                        }
                    }
                });
            }
        });
        this.lastPopupRef?.closed.pipe(take(1)).subscribe(() => keydownListenerRef?.());
    }
}
