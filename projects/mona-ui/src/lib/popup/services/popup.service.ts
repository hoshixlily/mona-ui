import { Injectable, Injector, NgZone, OnDestroy, Renderer2, RendererFactory2, TemplateRef } from "@angular/core";
import { PopupSettings } from "../models/PopupSettings";
import { Overlay, PositionStrategy } from "@angular/cdk/overlay";
import { ComponentPortal, TemplatePortal } from "@angular/cdk/portal";
import { PopupAnchorDirective } from "../directives/popup-anchor.directive";
import { PopupRef } from "../models/PopupRef";
import { PopupInjectionToken } from "../models/PopupInjectionToken";
import { DefaultPositions } from "../models/DefaultPositions";
import { fromEvent, merge, Subject, take, takeUntil } from "rxjs";
import { Dictionary } from "@mirei/ts-collections";
import { PopupState } from "../models/PopupState";
import { v4 } from "uuid";

@Injectable({
    providedIn: "root"
})
export class PopupService implements OnDestroy {
    public static popupAnchorDirective: PopupAnchorDirective;
    private readonly outsideEventsToClose = ["click", "mousedown", "dblclick", "contextmenu", "auxclick"];
    private readonly popupStateMap: Dictionary<string, PopupState> = new Dictionary<string, PopupState>();
    private readonly serviceDestroy$: Subject<void> = new Subject<void>();
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
        const uid = v4();
        let positionStrategy: PositionStrategy;
        if (settings.positionStrategy === "global") {
            positionStrategy = this.overlay.position().global();
        } else {
            positionStrategy = this.overlay
                .position()
                .flexibleConnectedTo(settings.anchor)
                .withPositions(settings.positions ?? DefaultPositions)
                .withDefaultOffsetX(settings.offset?.horizontal ?? 0)
                .withDefaultOffsetY(settings.offset?.vertical ?? 0)
                .withPush(settings.withPush ?? true);
        }

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
            backdropClass: settings.backdropClass ?? "transparent"
        });

        const popupRef = new PopupRef(overlayRef);

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
            if (settings.closeOnOutsideClick === true || settings.closeOnOutsideClick === undefined) {
                overlayRef
                    .backdropClick()
                    .pipe(take(1))
                    .subscribe(() => {
                        popupRef.close();
                    });
            }
        } else {
            if (settings.closeOnOutsideClick ?? true) {
                const subscription = overlayRef
                    .outsidePointerEvents()
                    .pipe(takeUntil(this.serviceDestroy$))
                    .subscribe(event => {
                        if (this.outsideEventsToClose.includes(event.type)) {
                            popupRef.close(event);
                            subscription.unsubscribe();
                        }
                    });
            }
        }
        popupRef.closed.pipe(take(1)).subscribe(() => {
            this.popupStateMap.remove(uid);
        });
        this.popupStateMap.add(uid, {
            uid,
            popupRef,
            settings
        });
        this.setEventListeners(this.popupStateMap.get(uid));
        return popupRef;
    }

    public ngOnDestroy(): void {
        this.serviceDestroy$.next();
        this.serviceDestroy$.complete();
    }

    private setEventListeners(state: PopupState): void {
        this.zone.runOutsideAngular(() => {
            if (state.settings.closeOnEscape ?? true) {
                fromEvent<KeyboardEvent>(document, "keydown")
                    .pipe(takeUntil(merge(state.popupRef.closed, this.serviceDestroy$)))
                    .subscribe(event => {
                        if (event.key === "Escape") {
                            state.popupRef.close();
                        }
                    });
            }
        });
    }
}
