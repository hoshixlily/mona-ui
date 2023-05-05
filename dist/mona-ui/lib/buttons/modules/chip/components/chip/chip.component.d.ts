import { EventEmitter, OnInit } from "@angular/core";
import * as i0 from "@angular/core";
export declare class ChipComponent implements OnInit {
    disabled: boolean;
    label: string;
    removable: boolean;
    remove: EventEmitter<Event>;
    tabindex: number;
    constructor();
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChipComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ChipComponent, "mona-chip", never, { "disabled": { "alias": "disabled"; "required": false; }; "label": { "alias": "label"; "required": false; }; "removable": { "alias": "removable"; "required": false; }; "tabindex": { "alias": "tabindex"; "required": false; }; }, { "remove": "remove"; }, never, ["*"], false, never>;
}
