import { PopupService } from "../../../../popup/services/popup.service";
import { ContextMenuSettings } from "../models/ContextMenuSettings";
import { PopupRef } from "../../../../popup/models/PopupRef";
import { ConnectedPosition } from "@angular/cdk/overlay";
import * as i0 from "@angular/core";
export declare class ContextMenuService {
    readonly popupService: PopupService;
    readonly defaultSubMenuPositions: ConnectedPosition[];
    constructor(popupService: PopupService);
    open(settings: ContextMenuSettings): PopupRef;
    static ɵfac: i0.ɵɵFactoryDeclaration<ContextMenuService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ContextMenuService>;
}
