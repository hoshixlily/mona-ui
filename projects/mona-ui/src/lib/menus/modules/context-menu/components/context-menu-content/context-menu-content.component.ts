import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    OnInit,
    QueryList,
    ViewChildren
} from "@angular/core";
import { ContextMenuInjectorData } from "../../models/ContextMenuInjectorData";
import { PopupDataInjectionToken } from "../../../../../popup/models/PopupInjectionToken";
import { ContextMenuService } from "../../services/context-menu.service";
import { MenuItem } from "../../models/MenuItem";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { ContextMenuItemComponent } from "../context-menu-item/context-menu-item.component";
import { ActiveDescendantKeyManager } from "@angular/cdk/a11y";
import { filter, fromEvent, Subject } from "rxjs";
import { AnimationService } from "../../../../../animations/animation.service";

@Component({
    selector: "mona-contextmenu-content",
    templateUrl: "./context-menu-content.component.html",
    styleUrls: ["./context-menu-content.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuContentComponent implements OnInit, AfterViewInit {
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
        private readonly animationService: AnimationService,
        private readonly cdr: ChangeDetectorRef,
        @Inject(PopupDataInjectionToken) public contextMenuData: ContextMenuInjectorData,
        private readonly contextMenuService: ContextMenuService,
        private readonly elementRef: ElementRef<HTMLElement>
    ) {}

    public ngAfterViewInit(): void {
        this.animateEnter();
        this.keyManager = new ActiveDescendantKeyManager<ContextMenuItemComponent>(this.contextMenuItemComponents)
            .withWrap()
            .skipPredicate(mi => !!mi.menuItem.disabled || !!mi.menuItem.divider);
        this.setEventListeners();
        this.focus();
        if (!this.contextMenuData.isRoot && this.contextMenuData.viaKeyboard) {
            this.keyManager.setFirstItemActive();
            this.cdr.detectChanges();
        }
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
        this.currentMenuItem = menuItem;
        this.menuPopupRef?.close();
        if (this.currentMenuItem.subMenuItems && this.currentMenuItem.subMenuItems.length > 0) {
            this.create(event.target as HTMLElement, this.currentMenuItem);
        }
    }

    private animateEnter(): void {
        this.animationService.animate({
            element: this.elementRef.nativeElement.firstElementChild as HTMLElement,
            duration: 150,
            startStyles: { transform: "translateY(-100%)", opacity: 1 },
            endStyles: { transform: "translateY(0)", opacity: 1 },
            timingFunction: "ease-out"
        });
        this.animationService.animate({
            element: this.elementRef.nativeElement.parentElement as HTMLElement,
            duration: 150,
            delay: 100,
            startStyles: { boxShadow: "none" },
            endStyles: { boxShadow: "var(--mona-popup-shadow)" },
            timingFunction: "ease-out"
        });
    }

    private create(anchor: HTMLElement, menuItem: MenuItem, viaKeyboard?: boolean): void {
        this.contextMenuInjectorData.menuItems = menuItem.subMenuItems;
        this.contextMenuInjectorData.menuClick = this.contextMenuData.menuClick;
        this.contextMenuInjectorData.navigate = this.contextMenuData.navigate;
        const popupClasses = this.contextMenuData.popupClass
            ? Array.isArray(this.contextMenuData.popupClass)
                ? this.contextMenuData.popupClass
                : [this.contextMenuData.popupClass]
            : [];
        this.contextMenuInjectorData.popupClass = popupClasses;
        this.menuPopupRef = this.contextMenuService.open({
            anchor,
            closeOnOutsideClick: true,
            content: ContextMenuContentComponent,
            data: this.contextMenuInjectorData,
            positions: this.contextMenuService.defaultSubMenuPositions,
            popupClass: ["mona-contextmenu-content", ...popupClasses]
        });
        this.contextMenuInjectorData.parentMenuRef = this.menuPopupRef;
        this.contextMenuInjectorData.viaKeyboard = viaKeyboard;
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
        fromEvent<KeyboardEvent>(this.elementRef.nativeElement, "keydown")
            .pipe(
                filter(
                    e =>
                        e.key === "ArrowDown" ||
                        e.key === "ArrowUp" ||
                        e.key === "ArrowRight" ||
                        e.key === "ArrowLeft" ||
                        e.key === "Enter" ||
                        e.key === " "
                )
            )
            .subscribe(event => {
                this.activeItemIndex = this.keyManager.activeItemIndex ?? -1;
                switch (event.key) {
                    case "ArrowDown":
                    case "ArrowUp":
                        const previousItem = this.keyManager.activeItem;
                        this.keyManager.onKeydown(event);
                        if (this.keyManager.activeItem !== previousItem) {
                            this.contextMenuData.navigate.emit({
                                previousItem: previousItem?.menuItem ?? null,
                                currentItem: this.keyManager.activeItem?.menuItem ?? null,
                                direction: event.key === "ArrowDown" ? "down" : "up"
                            });
                        }
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
                            if (this.keyManager.activeItem) {
                                this.keyManager.activeItem.menuItem.menuClick?.();
                                this.contextMenuData.menuClick?.next(this.keyManager.activeItem.menuItem);
                            }
                        }
                        break;
                    case "ArrowRight":
                        if (
                            this.keyManager.activeItem?.menuItem &&
                            this.keyManager.activeItem.menuItem.subMenuItems &&
                            this.keyManager.activeItem.menuItem.subMenuItems.length > 0
                        ) {
                            this.menuPopupRef?.close();
                            const previousItem = this.keyManager.activeItem;
                            if (this.keyManager.activeItem) {
                                this.create(
                                    this.keyManager.activeItem.elementRef.nativeElement,
                                    this.keyManager.activeItem.menuItem,
                                    true
                                );
                            }
                            this.contextMenuData.navigate.emit({
                                previousItem: previousItem?.menuItem ?? null,
                                currentItem:
                                    this.keyManager.activeItem?.menuItem.subMenuItems?.find(
                                        mi => !mi.disabled && !mi.divider
                                    ) ?? null,
                                direction: "right"
                            });
                        } else {
                            this.contextMenuData.navigate.emit({
                                previousItem: this.keyManager.activeItem?.menuItem ?? null,
                                currentItem: null,
                                direction: "right"
                            });
                        }
                        break;
                    case "ArrowLeft":
                        if (!this.contextMenuData.isRoot) {
                            this.contextMenuData.parentMenuRef?.close();
                            this.contextMenuData.subMenuClose?.next();
                            this.contextMenuData.navigate.emit({
                                previousItem: this.keyManager.activeItem?.menuItem ?? null,
                                currentItem: this.keyManager.activeItem?.menuItem.parent ?? null,
                                direction: "left"
                            });
                        } else {
                            this.contextMenuData.navigate.emit({
                                previousItem: this.keyManager.activeItem?.menuItem ?? null,
                                currentItem: null,
                                direction: "left"
                            });
                        }
                        break;
                }
                this.cdr.markForCheck();
            });
    }
}
