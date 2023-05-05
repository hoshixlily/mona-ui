import { AfterContentInit, OnInit, QueryList } from "@angular/core";
import { MenuItem } from "../../../context-menu/models/MenuItem";
import { MenuItemComponent } from "../../../shared-menu/components/menu-item/menu-item.component";
import { ContextMenuComponent } from "../../../context-menu/components/context-menu/context-menu.component";
import { MenuTextTemplateDirective } from "../../directives/menu-text-template.directive";
import * as i0 from "@angular/core";
export declare class MenuComponent implements OnInit, AfterContentInit {
    readonly uid: string;
    contextMenu: ContextMenuComponent | null;
    disabled: boolean;
    menuItemComponents: QueryList<MenuItemComponent>;
    menuItems: MenuItem[];
    text: string;
    textTemplate: MenuTextTemplateDirective | null;
    constructor();
    ngAfterContentInit(): void;
    ngOnInit(): void;
    private createMenuItems;
    private initializeMenuItems;
    static ɵfac: i0.ɵɵFactoryDeclaration<MenuComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MenuComponent, "mona-menu", never, { "disabled": { "alias": "disabled"; "required": false; }; "menuItems": { "alias": "menuItems"; "required": false; }; "text": { "alias": "text"; "required": false; }; }, {}, ["textTemplate", "menuItemComponents"], never, false, never>;
}
