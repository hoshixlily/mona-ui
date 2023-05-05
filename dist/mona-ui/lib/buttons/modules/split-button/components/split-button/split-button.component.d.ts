import { AfterContentInit, AfterViewInit, ChangeDetectorRef, EventEmitter, OnDestroy, QueryList, TemplateRef } from "@angular/core";
import { PopupOffset } from "../../../../../popup/models/PopupOffset";
import { MenuItemComponent } from "../../../../../menus/modules/shared-menu/components/menu-item/menu-item.component";
import { MenuItem } from "../../../../../menus/modules/context-menu/models/MenuItem";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import * as i0 from "@angular/core";
export declare class SplitButtonComponent implements AfterViewInit, AfterContentInit, OnDestroy {
    private readonly cdr;
    private readonly componentDestroy$;
    readonly menuIcon: IconDefinition;
    menuItems: MenuItem[];
    popupOffset: PopupOffset;
    popupWidth: number;
    buttonClick: EventEmitter<void>;
    private readonly contextMenuComponent;
    disabled: boolean;
    private readonly mainButtonElementRef;
    menuItemComponents: QueryList<MenuItemComponent>;
    text: string;
    textTemplate: TemplateRef<any> | null;
    private readonly wrapperElementRef;
    constructor(cdr: ChangeDetectorRef);
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SplitButtonComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SplitButtonComponent, "mona-split-button", never, { "disabled": { "alias": "disabled"; "required": false; }; "text": { "alias": "text"; "required": false; }; }, { "buttonClick": "buttonClick"; }, ["textTemplate", "menuItemComponents"], never, false, never>;
}
