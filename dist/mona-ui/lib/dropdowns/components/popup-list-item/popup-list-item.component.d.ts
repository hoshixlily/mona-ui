import { ElementRef, OnInit, TemplateRef } from "@angular/core";
import { PopupListItem } from "../../data/PopupListItem";
import * as i0 from "@angular/core";
export declare class PopupListItemComponent implements OnInit {
    readonly elementRef: ElementRef<HTMLElement>;
    item: PopupListItem | null;
    itemTemplate?: TemplateRef<any>;
    constructor(elementRef: ElementRef<HTMLElement>);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PopupListItemComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PopupListItemComponent, "mona-popup-list-item", never, { "item": { "alias": "item"; "required": false; }; "itemTemplate": { "alias": "itemTemplate"; "required": false; }; }, {}, never, never, true, never>;
}
