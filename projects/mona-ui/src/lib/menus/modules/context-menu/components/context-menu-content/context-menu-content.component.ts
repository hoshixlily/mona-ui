import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    NgZone,
    OnDestroy,
    OnInit,
    QueryList,
    Renderer2,
    ViewChildren
} from "@angular/core";
import { ContextMenuInjectorData } from "../../models/ContextMenuInjectorData";
import { PopupInjectionToken } from "../../../../../popup/models/PopupInjectionToken";
import { ContextMenuService } from "../../services/context-menu.service";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { Subject } from "rxjs";
import { ContextMenuItemComponent } from "../context-menu-item/context-menu-item.component";
import { ActiveDescendantKeyManager } from "@angular/cdk/a11y";
import { ContextMenuItem } from "../../models/ContextMenuItem";

@Component({
    selector: "mona-contextmenu-content",
    templateUrl: "./context-menu-content.component.html",
    styleUrls: ["./context-menu-content.component.scss"]
})
export class ContextMenuContentComponent implements OnInit, OnDestroy, AfterViewInit {
    private id: string = Math.random().toString();
    private keyManager!: ActiveDescendantKeyManager<ContextMenuItemComponent>;
    private parentMenuCloseNotifier: Subject<void> = new Subject();
    private submenuCloseNotifier: Subject<string> = new Subject();
    // private subMenuPopupRef: PopupRef | null = null;
    public currentMenuItem: ContextMenuItem | null = null;
    public hoveredListElement: HTMLLIElement | null = null;
    public iconSpaceVisible: boolean = false;
    public linkSpaceVisible: boolean = false;
    public menuPopupRef: PopupRef | null = null;

    @ViewChildren(ContextMenuItemComponent)
    public contextMenuItemComponents: QueryList<ContextMenuItemComponent> = new QueryList<ContextMenuItemComponent>();

    public constructor(
        @Inject(PopupInjectionToken) public contextMenuData: ContextMenuInjectorData,
        private readonly cdr: ChangeDetectorRef,
        private readonly contextMenuService: ContextMenuService,
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly renderer: Renderer2,
        private readonly zone: NgZone
    ) {}

    public ngAfterViewInit(): void {
        this.keyManager = new ActiveDescendantKeyManager<ContextMenuItemComponent>(this.contextMenuItemComponents)
            .withWrap()
            .skipPredicate(mi => !!mi.menuItem?.disabled || !!mi.menuItem?.divider);
        this.focus();
        if (this.contextMenuData.viaKeyboard) {
            this.keyManager.setFirstItemActive();
            this.cdr.detectChanges();
        }
    }

    public ngOnDestroy(): void {
        this.parentMenuCloseNotifier.next();
        this.parentMenuCloseNotifier.complete();
        if (this.currentMenuItem) {
            this.currentMenuItem.focused = false;
        }
    }

    public ngOnInit(): void {
        this.iconSpaceVisible = this.contextMenuData.menuItems.some(mi => mi.iconClass || mi.iconTemplate);
        this.linkSpaceVisible = this.contextMenuData.menuItems.some(
            mi => mi.subMenuItems && mi.subMenuItems.length > 0
        );
        this.contextMenuService.currentContextMenuContentId = this.id;
        this.setEventListeners();
    }

    public onListItemClick(event: MouseEvent, menuItem: ContextMenuItem): void {
        if (menuItem.disabled || menuItem.divider || (menuItem.subMenuItems && menuItem.subMenuItems.length > 0)) {
            return;
        }
        menuItem.menuClick?.();
        this.contextMenuData.menuClick?.next(menuItem);
    }

    public onListItemMouseEnter(event: MouseEvent, menuItem: ContextMenuItem): void {
        if (
            this.currentMenuItem !== menuItem &&
            this.currentMenuItem?.subMenuItems &&
            this.currentMenuItem.subMenuItems.length > 0
        ) {
            this.parentMenuCloseNotifier.next();
        }
        if (this.currentMenuItem && this.currentMenuItem !== menuItem) {
            this.currentMenuItem.focused = false;
        }
        this.currentMenuItem = menuItem;
        this.menuPopupRef?.close();
        if (menuItem.subMenuItems && menuItem.subMenuItems.length > 0 && event.target) {
            this.menuPopupRef = this.create(event.target as HTMLElement, menuItem);
        }
    }

    public onListItemMouseLeave(event: MouseEvent, menuItem: ContextMenuItem): void {
        menuItem.focused = false;
        this.parentMenuCloseNotifier.next();
    }

    private create(anchor: HTMLElement, menuItem: ContextMenuItem, viaKeyboard: boolean = false): PopupRef {
        const popupRef = this.contextMenuService.open({
            anchor,
            content: ContextMenuContentComponent,
            data: {
                menuClick: this.contextMenuData.menuClick,
                menuItems: menuItem.subMenuItems ?? [],
                parentClose: this.parentMenuCloseNotifier,
                parentId: this.id,
                submenuClose: this.submenuCloseNotifier,
                viaKeyboard
            } as ContextMenuInjectorData,
            positions: this.contextMenuService.defaultSubMenuPositions,
            popupClass: ["mona-contextmenu-content"]
        });
        if (this.contextMenuData.parentClose) {
            const subscription = this.contextMenuData.parentClose.subscribe(() => {
                menuItem.focused = false;
                popupRef?.close();
                this.parentMenuCloseNotifier.next();
                subscription.unsubscribe();
            });
        }
        return popupRef;
    }

    private focus(): void {
        window.setTimeout(() => {
            const listElement = this.elementRef.nativeElement.querySelector("ul:first-child") as HTMLUListElement;
            if (listElement) {
                listElement.focus();
            }
        });
    }

    private selectItem(menuItem: ContextMenuItem): void {
        if (menuItem.disabled || menuItem.divider || (menuItem.subMenuItems && menuItem.subMenuItems.length > 0)) {
            return;
        }
        menuItem.menuClick?.();
        this.contextMenuData.menuClick?.next(menuItem);
    }

    private setEventListeners(): void {
        this.zone.runOutsideAngular(() => {
            this.renderer.listen(this.elementRef.nativeElement, "keydown", (event: KeyboardEvent) => {
                switch (event.key) {
                    case "ArrowDown":
                    case "ArrowUp":
                        this.zone.run(() => this.keyManager.onKeydown(event));
                        break;
                    case "Enter":
                    case " ":
                        if (this.keyManager.activeItem?.menuItem) {
                            this.selectItem(this.keyManager.activeItem?.menuItem);
                        }
                        break;
                    case "ArrowRight":
                        if (!this.keyManager.activeItem?.menuItem) {
                            return;
                        }
                        if (
                            this.keyManager.activeItem?.menuItem.subMenuItems &&
                            this.keyManager.activeItem?.menuItem.subMenuItems.length === 0
                        ) {
                            return;
                        }
                        this.zone.run(() => {
                            if (this.keyManager.activeItem?.menuItem) {
                                this.contextMenuData.submenuPopupRef = this.create(
                                    this.keyManager.activeItem.elementRef.nativeElement,
                                    this.keyManager.activeItem.menuItem,
                                    true
                                );
                            }
                        });
                        break;
                    case "ArrowLeft":
                        this.zone.run(() => {
                            if (this.keyManager.activeItem?.menuItem) {
                                this.keyManager.activeItem.menuItem.focused = false;
                            }
                            this.contextMenuData.submenuClose?.next(this.contextMenuData.parentId ?? "");
                        });
                        break;
                }
            });
        });

        // TODO: Unsubscribe on destroy
        this.submenuCloseNotifier.subscribe(id => {
            if (id === this.id) {
                this.contextMenuData.submenuPopupRef?.close();
                this.focus();
            }
        });
    }
}
