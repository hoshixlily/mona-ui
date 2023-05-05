import { AfterContentInit, AfterViewInit, ChangeDetectorRef, OnDestroy, OnInit, QueryList } from "@angular/core";
import { MenuComponent } from "../menu/menu.component";
import { ContextMenuComponent } from "../../../context-menu/components/context-menu/context-menu.component";
import { ContextMenuCloseEvent } from "../../../context-menu/models/ContextMenuCloseEvent";
import { ContextMenuOpenEvent } from "../../../context-menu/models/ContextMenuOpenEvent";
import { ContextMenuNavigationEvent } from "../../../context-menu/models/ContextMenuNavigationEvent";
import * as i0 from "@angular/core";
export declare class MenubarComponent implements OnInit, AfterViewInit, OnDestroy, AfterContentInit {
    private readonly cdr;
    private readonly componentDestroy$;
    readonly contextMenuComponents: QueryList<ContextMenuComponent>;
    currentContextMenu: ContextMenuComponent | null;
    menuList: QueryList<MenuComponent>;
    constructor(cdr: ChangeDetectorRef);
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
    onContextMenuClose(event: ContextMenuCloseEvent): void;
    onContextMenuNavigate(event: ContextMenuNavigationEvent): void;
    onContextMenuOpen(event: ContextMenuOpenEvent): void;
    onMenuClick(ctx: ContextMenuComponent): void;
    onMenuMouseEnter(ctx: ContextMenuComponent): void;
    private findNextNonDisabledMenuIndex;
    private findPreviousNonDisabledMenuIndex;
    static ɵfac: i0.ɵɵFactoryDeclaration<MenubarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MenubarComponent, "mona-menubar", never, {}, {}, ["menuList"], never, false, never>;
}
