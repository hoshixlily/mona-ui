import { ElementRef, EventEmitter, OnDestroy, OnInit } from "@angular/core";
import { ButtonService } from "../../../services/button.service";
import * as i0 from "@angular/core";
export declare class ButtonDirective implements OnInit, OnDestroy {
    #private;
    private readonly buttonService;
    readonly elementRef: ElementRef<HTMLButtonElement>;
    private readonly destroy$;
    disabled: boolean;
    flat: boolean;
    primary: boolean;
    set selected(selected: boolean);
    get selected(): boolean;
    selectedChange: EventEmitter<boolean>;
    toggleable: boolean;
    constructor(buttonService: ButtonService, elementRef: ElementRef<HTMLButtonElement>);
    ngOnDestroy(): void;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ButtonDirective, [{ optional: true; host: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ButtonDirective, "[monaButton]", never, { "disabled": { "alias": "disabled"; "required": false; }; "flat": { "alias": "flat"; "required": false; }; "primary": { "alias": "primary"; "required": false; }; "selected": { "alias": "selected"; "required": false; }; "toggleable": { "alias": "toggleable"; "required": false; }; }, { "selectedChange": "selectedChange"; }, never, never, false, never>;
}
