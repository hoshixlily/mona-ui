import { Overlay, PositionStrategy } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { DestroyRef, inject, Injectable, Injector, TemplateRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Dictionary } from "@mirei/ts-collections";
import { filter, fromEvent, Subject, take, takeUntil } from "rxjs";
import { v4 } from "uuid";
import { PopupWrapperComponent } from "../components/popup-wrapper/popup-wrapper.component";
import { DefaultPositions } from "../models/DefaultPositions";
import { PopupCloseEvent, PopupCloseSource } from "../models/PopupCloseEvent";
import { PopupDataInjectionToken, PopupSettingsInjectionToken } from "../models/PopupInjectionToken";
import { PopupRef } from "../models/PopupRef";
import { PopupReference } from "../models/PopupReference";
import { PopupSettings } from "../models/PopupSettings";
import { PopupState } from "../models/PopupState";

@Injectable({
    providedIn: "root"
})
export class PopupService {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    private readonly outsideEventsToClose = ["click", "mousedown", "dblclick", "contextmenu", "auxclick"];
    private readonly popupStateMap: Dictionary<string, PopupState> = new Dictionary<string, PopupState>();

    public constructor(
        private readonly injector: Injector,
        private readonly overlay: Overlay
    ) {}

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

        const preventClose = settings.preventClose;
        const popupReference = new PopupReference(overlayRef);

        const injector = Injector.create({
            parent: this.injector,
            providers: [
                { provide: PopupRef, useFactory: () => popupReference.popupRef },
                { provide: PopupDataInjectionToken, useValue: settings.data },
                { provide: PopupSettingsInjectionToken, useValue: settings },
                ...(settings.providers ?? [])
            ]
        });

        if (settings.content instanceof TemplateRef) {
            const portal = new ComponentPortal(PopupWrapperComponent, null, injector);
            popupReference.componentRef = overlayRef.attach(portal);
            const component = popupReference.componentRef.instance as PopupWrapperComponent;
            component.templateRef.set(settings.content);
            popupReference.componentRef.changeDetectorRef.detectChanges();
        } else {
            const portal = new ComponentPortal(settings.content, null, injector);
            popupReference.componentRef = overlayRef.attach(portal);
        }

        if (settings.hasBackdrop) {
            if (settings.closeOnBackdropClick ?? true) {
                const backdropSubject: Subject<void> = new Subject<void>();
                const subscription = overlayRef
                    .backdropClick()
                    .pipe(takeUntil(backdropSubject))
                    .subscribe(e => {
                        const event = new PopupCloseEvent({
                            event: e,
                            originalEvent: e,
                            via: PopupCloseSource.BackdropClick
                        });
                        const prevented = preventClose ? preventClose(event) || event.isDefaultPrevented() : false;
                        if (!prevented) {
                            popupReference.close(event);
                            this.popupStateMap.remove(uid);
                            backdropSubject.next();
                            backdropSubject.complete();
                        }
                    });
                popupReference.closed.pipe(take(1)).subscribe(() => subscription.unsubscribe());
            }
        } else {
            if (settings.closeOnOutsideClick ?? true) {
                const subscription = overlayRef
                    .outsidePointerEvents()
                    .pipe(takeUntilDestroyed(this.#destroyRef))
                    .subscribe(event => {
                        if (this.outsideEventsToClose.includes(event.type)) {
                            const closeEvent = new PopupCloseEvent({
                                event,
                                originalEvent: event,
                                via: PopupCloseSource.OutsideClick
                            });
                            const prevented = preventClose
                                ? preventClose(closeEvent) || closeEvent.isDefaultPrevented()
                                : false;
                            if (!prevented) {
                                popupReference.close(closeEvent);
                                this.popupStateMap.remove(uid);
                                subscription.unsubscribe();
                            }
                        }
                    });
                popupReference.closed.pipe(take(1)).subscribe(() => subscription.unsubscribe());
            }
        }
        popupReference.closed.pipe(take(1)).subscribe(() => {
            this.popupStateMap.remove(uid);
        });
        this.popupStateMap.add(uid, {
            uid,
            popupRef: popupReference.popupRef,
            settings
        });
        this.setEventListeners(this.popupStateMap.get(uid) as PopupState);
        return popupReference.popupRef;
    }

    private setEventListeners(state: PopupState): void {
        if (state.settings.closeOnEscape ?? true) {
            fromEvent<KeyboardEvent>(document, "keydown")
                .pipe(
                    filter(() => state.popupRef.overlayRef.hasAttached()),
                    filter(event => event.key === "Escape"),
                    takeUntil(state.popupRef.closed)
                )
                .subscribe(event => {
                    if (event.key === "Escape") {
                        const closeEvent = new PopupCloseEvent({
                            event,
                            originalEvent: event,
                            via: PopupCloseSource.Escape
                        });
                        const prevented = state.settings.preventClose
                            ? state.settings.preventClose(closeEvent) || closeEvent.isDefaultPrevented()
                            : false;
                        if (!prevented) {
                            state.popupRef.close(closeEvent);
                            this.popupStateMap.remove(state.uid);
                        }
                    }
                });
        }
    }
}
