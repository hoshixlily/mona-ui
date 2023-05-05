import { Injector, NgZone, OnDestroy, RendererFactory2 } from "@angular/core";
import { PopupSettings } from "../models/PopupSettings";
import { Overlay } from "@angular/cdk/overlay";
import { PopupAnchorDirective } from "../directives/popup-anchor.directive";
import { PopupRef } from "../models/PopupRef";
import * as i0 from "@angular/core";
export declare class PopupService implements OnDestroy {
    private readonly injector;
    private readonly overlay;
    private readonly rendererFactory;
    private readonly zone;
    static popupAnchorDirective: PopupAnchorDirective;
    private readonly outsideEventsToClose;
    private readonly popupStateMap;
    private readonly serviceDestroy$;
    private renderer;
    constructor(injector: Injector, overlay: Overlay, rendererFactory: RendererFactory2, zone: NgZone);
    create(settings: PopupSettings): PopupRef;
    ngOnDestroy(): void;
    private setEventListeners;
    static ɵfac: i0.ɵɵFactoryDeclaration<PopupService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PopupService>;
}
