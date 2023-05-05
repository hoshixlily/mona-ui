import { ElementRef, OnDestroy, OnInit } from "@angular/core";
import { MenuItem } from "../../models/MenuItem";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { Highlightable } from "@angular/cdk/a11y";
import * as i0 from "@angular/core";
export declare class ContextMenuItemComponent implements OnInit, OnDestroy, Highlightable {
    readonly elementRef: ElementRef<HTMLElement>;
    readonly starIcon: IconDefinition;
    iconSpaceVisible: boolean;
    linkSpaceVisible: boolean;
    menuItem: MenuItem;
    submenuPopupRef?: PopupRef | null;
    constructor(elementRef: ElementRef<HTMLElement>);
    ngOnDestroy(): void;
    ngOnInit(): void;
    setActiveStyles(): void;
    setInactiveStyles(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ContextMenuItemComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ContextMenuItemComponent, "mona-contextmenu-item", never, { "iconSpaceVisible": { "alias": "iconSpaceVisible"; "required": false; }; "linkSpaceVisible": { "alias": "linkSpaceVisible"; "required": false; }; "menuItem": { "alias": "menuItem"; "required": false; }; "submenuPopupRef": { "alias": "submenuPopupRef"; "required": false; }; }, {}, never, never, false, never>;
}
