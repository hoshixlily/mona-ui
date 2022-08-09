import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { ContextMenuInjectorData } from "../../models/ContextMenuInjectorData";
import { PopupInjectionToken } from "../../../../../popup/models/PopupInjectionToken";
import { ContextMenuService } from "../../services/context-menu.service";
import { MenuItem } from "../../models/MenuItem";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { Subject } from "rxjs";

@Component({
    selector: "mona-contextmenu-content",
    templateUrl: "./context-menu-content.component.html",
    styleUrls: ["./context-menu-content.component.scss"]
})
export class ContextMenuContentComponent implements OnInit, OnDestroy {
    private contextMenuInjectorData: Partial<ContextMenuInjectorData> = {};
    private submenuCloseNotifier: Subject<void> = new Subject();
    public currentMenuItem: MenuItem | null = null;
    public iconSpaceVisible: boolean = false;
    public linkSpaceVisible: boolean = false;
    public menuPopupRef: PopupRef | null = null;

    public constructor(
        @Inject(PopupInjectionToken) public contextMenuData: ContextMenuInjectorData,
        private readonly contextMenuService: ContextMenuService
    ) {}

    public ngOnDestroy(): void {
        this.submenuCloseNotifier.next();
        this.submenuCloseNotifier.complete();
    }

    public ngOnInit(): void {
        this.iconSpaceVisible = this.contextMenuData.menuItems.some(mi => mi.iconClass || mi.iconTemplate);
        this.linkSpaceVisible = this.contextMenuData.menuItems.some(
            mi => mi.subMenuItems && mi.subMenuItems.length > 0
        );
    }

    public onListItemClick(event: MouseEvent, menuItem: MenuItem): void {
        if (menuItem.disabled || menuItem.divider || (menuItem.subMenuItems && menuItem.subMenuItems.length > 0)) {
            return;
        }
        menuItem.menuClick?.();
        this.contextMenuData.menuClick?.next(menuItem);
    }

    public onListItemMouseEnter(event: MouseEvent, menuItem: MenuItem): void {
        if (
            this.currentMenuItem !== menuItem &&
            this.currentMenuItem?.subMenuItems &&
            this.currentMenuItem.subMenuItems.length > 0
        ) {
            this.submenuCloseNotifier.next();
        }
        this.currentMenuItem = menuItem;
        this.menuPopupRef?.close();
        if (this.currentMenuItem.subMenuItems && this.currentMenuItem.subMenuItems.length > 0) {
            this.create(event.target as HTMLElement, this.currentMenuItem);
        }
    }

    public onListItemMouseLeave(event: MouseEvent): void {
        this.submenuCloseNotifier.next();
    }

    private create(anchor: HTMLElement, menuItem: MenuItem): void {
        this.contextMenuInjectorData.menuItems = menuItem.subMenuItems;
        this.contextMenuInjectorData.menuClick = this.contextMenuData.menuClick;
        this.menuPopupRef = this.contextMenuService.open({
            anchor,
            closeOnOutsideClick: false,
            content: ContextMenuContentComponent,
            data: this.contextMenuInjectorData,
            positions: this.contextMenuService.defaultSubMenuPositions,
            popupClass: ["mona-contextmenu-content"]
        });
        this.contextMenuInjectorData.parentMenuRef = this.menuPopupRef;
        if (this.contextMenuData.parentMenuRef) {
            const subscription = this.contextMenuData.parentMenuRef.closed.subscribe(() => {
                this.menuPopupRef?.close();
                this.submenuCloseNotifier.next();
                subscription.unsubscribe();
            });
        }
    }
}
