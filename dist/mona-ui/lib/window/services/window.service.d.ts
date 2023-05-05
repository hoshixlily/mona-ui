import { PopupService } from "../../popup/services/popup.service";
import { WindowSettings } from "../models/WindowSettings";
import { WindowRef } from "../models/WindowRef";
import * as i0 from "@angular/core";
export declare class WindowService {
    private readonly popupService;
    constructor(popupService: PopupService);
    open(settings: WindowSettings): WindowRef;
    static ɵfac: i0.ɵɵFactoryDeclaration<WindowService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<WindowService>;
}
