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
    private submenuCloseNotifier: Subject<void> = new Subject();
    public currentMenuItem: MenuItem | null = null;
    public hoveredListElement: HTMLLIElement | null = null;
    public menuPopupRef: PopupRef | null = null;

    public constructor(
        @Inject(PopupInjectionToken) public contextMenuData: ContextMenuInjectorData,
        private readonly contextMenuService: ContextMenuService
    ) {}

    public ngOnDestroy(): void {
        this.submenuCloseNotifier.next();
        this.submenuCloseNotifier.complete();
    }

    public ngOnInit(): void {}

    public onListItemMouseEntered(event: MouseEvent, menuItem: MenuItem): void {
        this.hoveredListElement = event.target as HTMLLIElement;
        this.currentMenuItem = menuItem;
        this.menuPopupRef?.close();
        this.submenuCloseNotifier.next();
        if (this.currentMenuItem.subMenuItems && this.currentMenuItem.subMenuItems.length > 0) {
            this.create();
        }
    }

    public onListItemMouseLeft(event: MouseEvent): void {
        this.submenuCloseNotifier.next();
    }

    private create(): void {
        this.menuPopupRef?.close();
        if (this.hoveredListElement && this.currentMenuItem) {
            this.menuPopupRef = this.contextMenuService.open({
                anchor: this.hoveredListElement,
                content: ContextMenuContentComponent,
                data: {
                    menuItems: this.currentMenuItem.subMenuItems ?? [],
                    parentClose: this.submenuCloseNotifier
                } as ContextMenuInjectorData,
                positions: this.contextMenuService.defaultSubMenuPositions,
                popupClass: ["mona-contextmenu-content"]
            });
            if (this.contextMenuData.parentClose) {
                const subscription = this.contextMenuData.parentClose.subscribe(() => {
                    this.menuPopupRef?.close();
                    this.submenuCloseNotifier.next();
                    // subscription.unsubscribe();
                });
            }
        }
    }
}
