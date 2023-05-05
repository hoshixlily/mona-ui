import { ElementRef, OnInit, TemplateRef } from "@angular/core";
import { PopupService } from "../../../../../popup/services/popup.service";
import { Position } from "../../../../../models/Position";
import * as i0 from "@angular/core";
export declare class TooltipComponent implements OnInit {
    private readonly elementRef;
    private readonly popupService;
    private readonly componentDestroy$;
    private popupRef?;
    readonly uid: string;
    position: Position;
    target: Element | ElementRef;
    templateRef: TemplateRef<any>;
    constructor(elementRef: ElementRef<HTMLElement>, popupService: PopupService);
    ngOnInit(): void;
    private calculateTopAndLeft;
    private setSubscriptions;
    private get tooltipElement();
    private get tooltipOverlayElement();
    static ɵfac: i0.ɵɵFactoryDeclaration<TooltipComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TooltipComponent, "mona-tooltip", never, { "position": { "alias": "position"; "required": false; }; "target": { "alias": "target"; "required": false; }; }, {}, never, ["*"], false, never>;
}
