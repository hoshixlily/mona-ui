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
import { MenuItem } from "../../models/MenuItem";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { ContextMenuItemComponent } from "../context-menu-item/context-menu-item.component";
import { ActiveDescendantKeyManager } from "@angular/cdk/a11y";
import { Subject } from "rxjs";

@Component({
    selector: "mona-contextmenu-content",
    templateUrl: "./context-menu-content.component.html",
    styleUrls: ["./context-menu-content.component.scss"]
})
export class ContextMenuContentComponent implements OnInit, OnDestroy, AfterViewInit {
    private contextMenuInjectorData: Partial<ContextMenuInjectorData> = { isRoot: false };
    public activeItemIndex: number = -1;
    public currentMenuItem: MenuItem | null = null;
    public iconSpaceVisible: boolean = false;
    public keyManager!: ActiveDescendantKeyManager<ContextMenuItemComponent>;
    public linkSpaceVisible: boolean = false;
    public menuPopupRef: PopupRef | null = null;

    @ViewChildren(ContextMenuItemComponent)
    private contextMenuItemComponents: QueryList<ContextMenuItemComponent> = new QueryList<ContextMenuItemComponent>();

    public constructor(
        private readonly cdr: ChangeDetectorRef,
        @Inject(PopupInjectionToken) public contextMenuData: ContextMenuInjectorData,
        private readonly contextMenuService: ContextMenuService,
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly renderer: Renderer2,
        private readonly zone: NgZone
    ) {}

    public ngAfterViewInit(): void {
        this.keyManager = new ActiveDescendantKeyManager<ContextMenuItemComponent>(this.contextMenuItemComponents)
            .withWrap()
            .skipPredicate(mi => !!mi.menuItem.disabled || !!mi.menuItem.divider);
        this.setEventListeners();
        this.focus();
        if (!this.contextMenuData.isRoot) {
            this.keyManager.setFirstItemActive();
            this.cdr.detectChanges();
        }
    }

    public ngOnDestroy(): void {}

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
        this.currentMenuItem = menuItem;
        this.menuPopupRef?.close();
        if (this.currentMenuItem.subMenuItems && this.currentMenuItem.subMenuItems.length > 0) {
            this.create(event.target as HTMLElement, this.currentMenuItem);
        }
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
        this.contextMenuInjectorData.subMenuClose = new Subject<void>();
        if (this.contextMenuData.parentMenuRef) {
            const subscription = this.contextMenuData.parentMenuRef.closed.subscribe(() => {
                this.menuPopupRef?.close();
                subscription.unsubscribe();
            });
        }
        this.contextMenuInjectorData.subMenuClose.subscribe(() => {
            this.focus();
        });
    }

    private focus(): void {
        const listElement = this.elementRef.nativeElement.querySelector("ul:first-child") as HTMLUListElement;
        listElement?.focus();
    }

    private setEventListeners(): void {
        this.zone.runOutsideAngular(() => {
            this.renderer.listen(this.elementRef.nativeElement, "keydown", (event: KeyboardEvent) => {
                this.activeItemIndex = this.keyManager.activeItemIndex ?? -1;
                switch (event.key) {
                    case "ArrowDown":
                    case "ArrowUp":
                        this.zone.run(() => this.keyManager.onKeydown(event));
                        break;
                    case "Enter":
                    case " ":
                        if (this.keyManager.activeItem?.menuItem) {
                            if (
                                this.keyManager.activeItem.menuItem.subMenuItems &&
                                this.keyManager.activeItem.menuItem.subMenuItems.length > 0
                            ) {
                                return;
                            }
                            this.zone.run(() => {
                                if (this.keyManager.activeItem) {
                                    this.keyManager.activeItem.menuItem.menuClick?.();
                                    this.contextMenuData.menuClick?.next(this.keyManager.activeItem.menuItem);
                                }
                            });
                        }
                        break;
                    case "ArrowRight":
                        if (
                            this.keyManager.activeItem?.menuItem &&
                            this.keyManager.activeItem.menuItem.subMenuItems &&
                            this.keyManager.activeItem.menuItem.subMenuItems.length > 0
                        ) {
                            this.zone.run(() => {
                                this.menuPopupRef?.close();
                                if (this.keyManager.activeItem) {
                                    this.create(
                                        this.keyManager.activeItem.elementRef.nativeElement,
                                        this.keyManager.activeItem.menuItem
                                    );
                                }
                            });
                        }
                        break;
                    case "ArrowLeft":
                        this.zone.run(() => {
                            if (!this.contextMenuData.isRoot) {
                                this.contextMenuData.parentMenuRef?.close();
                                this.contextMenuData.subMenuClose?.next();
                            }
                        });
                        break;
                }
            });
        });
    }
}
