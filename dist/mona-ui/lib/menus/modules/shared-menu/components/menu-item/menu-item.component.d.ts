import { AfterContentInit, EventEmitter, OnDestroy, OnInit, QueryList, TemplateRef } from "@angular/core";
import { MenuItem } from "../../../context-menu/models/MenuItem";
import * as i0 from "@angular/core";
export declare class MenuItemComponent implements OnInit, AfterContentInit, OnDestroy {
    private readonly componentDestroy$;
    private menuItem;
    set data(data: unknown);
    set disabled(disabled: boolean);
    set divider(divider: boolean);
    set iconClass(iconClass: string);
    iconTemplate: QueryList<TemplateRef<any>>;
    menuClick: EventEmitter<void>;
    submenuItems: QueryList<MenuItemComponent>;
    set text(text: string);
    textTemplate: QueryList<TemplateRef<any>>;
    set visible(visible: boolean);
    constructor();
    getMenuItem(): MenuItem;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
    private getMenuItemWithDepth;
    static ɵfac: i0.ɵɵFactoryDeclaration<MenuItemComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MenuItemComponent, "mona-menu-item", never, { "data": { "alias": "data"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "divider": { "alias": "divider"; "required": false; }; "iconClass": { "alias": "iconClass"; "required": false; }; "text": { "alias": "text"; "required": false; }; "visible": { "alias": "visible"; "required": false; }; }, { "menuClick": "menuClick"; }, ["iconTemplate", "submenuItems", "textTemplate"], never, false, never>;
}
