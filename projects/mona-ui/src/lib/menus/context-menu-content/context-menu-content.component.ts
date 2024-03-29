import { ActiveDescendantKeyManager } from "@angular/cdk/a11y";
import { NgClass } from "@angular/common";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    OnInit,
    QueryList,
    signal,
    ViewChildren,
    WritableSignal
} from "@angular/core";
import { any } from "@mirei/ts-collections";
import { filter, fromEvent, Subject } from "rxjs";
import { AnimationService } from "../../animations/services/animation.service";
import { PopupDataInjectionToken } from "../../popup/models/PopupInjectionToken";
import { PopupRef } from "../../popup/models/PopupRef";
import { ContextMenuItemComponent } from "../context-menu-item/context-menu-item.component";
import { ContextMenuInjectorData } from "../models/ContextMenuInjectorData";
import { MenuItem } from "../models/MenuItem";
import { ContextMenuService } from "../services/context-menu.service";

@Component({
    selector: "mona-contextmenu-content",
    templateUrl: "./context-menu-content.component.html",
    styleUrls: ["./context-menu-content.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgClass, ContextMenuItemComponent]
})
export class ContextMenuContentComponent implements OnInit, AfterViewInit {
    readonly #animationService: AnimationService = inject(AnimationService);
    readonly #cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    readonly #contextMenuInjectorData: Partial<ContextMenuInjectorData> = { isRoot: false };
    readonly #contextMenuService: ContextMenuService = inject(ContextMenuService);
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    #currentMenuItem: MenuItem | null = null;
    protected readonly iconSpaceVisible: WritableSignal<boolean> = signal(false);
    protected readonly linkSpaceVisible: WritableSignal<boolean> = signal(false);
    protected readonly menuPopupRef: WritableSignal<PopupRef | null> = signal(null);
    public readonly contextMenuData: ContextMenuInjectorData = inject<ContextMenuInjectorData>(PopupDataInjectionToken);
    public keyManager!: ActiveDescendantKeyManager<ContextMenuItemComponent>;

    @ViewChildren(ContextMenuItemComponent)
    private contextMenuItemComponents: QueryList<ContextMenuItemComponent> = new QueryList<ContextMenuItemComponent>();

    public ngAfterViewInit(): void {
        this.animateEnter();
        this.keyManager = new ActiveDescendantKeyManager<ContextMenuItemComponent>(this.contextMenuItemComponents)
            .withWrap()
            .skipPredicate(mi => {
                const menuItem = mi.menuItem();
                return menuItem.disabled || !!menuItem.divider;
            });
        this.setEventListeners();
        this.focus();
        if (!this.contextMenuData.isRoot && this.contextMenuData.viaKeyboard) {
            this.keyManager.setFirstItemActive();
            this.#cdr.detectChanges();
        }
    }

    public ngOnInit(): void {
        this.iconSpaceVisible.set(any(this.contextMenuData.menuItems, mi => !!mi.iconClass || !!mi.iconTemplate));
        this.linkSpaceVisible.set(
            any(this.contextMenuData.menuItems, mi => !!mi.subMenuItems && mi.subMenuItems.length > 0)
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
        this.#currentMenuItem = menuItem;
        this.menuPopupRef()?.close();
        if (this.#currentMenuItem.subMenuItems && this.#currentMenuItem.subMenuItems.length > 0) {
            this.create(event.target as HTMLElement, this.#currentMenuItem);
        }
    }

    private animateEnter(): void {
        this.#animationService.animate({
            element: this.#hostElementRef.nativeElement.firstElementChild as HTMLElement,
            duration: 150,
            startStyles: { transform: "translateY(-100%)", opacity: 1 },
            endStyles: { transform: "translateY(0)", opacity: 1 },
            timingFunction: "ease-out"
        });
        this.#animationService.animate({
            element: this.#hostElementRef.nativeElement.parentElement as HTMLElement,
            duration: 150,
            delay: 100,
            startStyles: { boxShadow: "none" },
            endStyles: { boxShadow: "var(--mona-popup-shadow)" },
            timingFunction: "ease-out"
        });
    }

    private create(anchor: HTMLElement, menuItem: MenuItem, viaKeyboard?: boolean): void {
        this.#contextMenuInjectorData.menuItems = menuItem.subMenuItems;
        this.#contextMenuInjectorData.menuClick = this.contextMenuData.menuClick;
        this.#contextMenuInjectorData.navigate = this.contextMenuData.navigate;
        const popupClasses = this.contextMenuData.popupClass
            ? Array.isArray(this.contextMenuData.popupClass)
                ? this.contextMenuData.popupClass
                : [this.contextMenuData.popupClass]
            : [];
        this.#contextMenuInjectorData.popupClass = popupClasses;
        const popupRef = this.#contextMenuService.open({
            anchor,
            closeOnOutsideClick: true,
            content: ContextMenuContentComponent,
            data: this.#contextMenuInjectorData,
            positions: this.#contextMenuService.defaultSubMenuPositions,
            popupClass: ["mona-contextmenu-content", ...popupClasses]
        });
        this.menuPopupRef.set(popupRef);
        this.#contextMenuInjectorData.parentMenuRef = popupRef;
        this.#contextMenuInjectorData.viaKeyboard = viaKeyboard;
        this.#contextMenuInjectorData.subMenuClose = new Subject<void>();
        if (this.contextMenuData.parentMenuRef) {
            const subscription = this.contextMenuData.parentMenuRef.closed.subscribe(() => {
                this.menuPopupRef()?.close();
                subscription.unsubscribe();
            });
        }
        this.#contextMenuInjectorData.subMenuClose.subscribe(() => {
            this.focus();
        });
    }

    private focus(): void {
        const listElement = this.#hostElementRef.nativeElement.querySelector("ul:first-child") as HTMLUListElement;
        listElement?.focus();
    }

    private handleArrowLeftKey(): void {
        if (!this.contextMenuData.isRoot) {
            this.contextMenuData.parentMenuRef?.close();
            this.contextMenuData.subMenuClose?.next();
            this.contextMenuData.navigate.emit({
                previousItem: this.keyManager.activeItem?.menuItem() ?? null,
                currentItem: this.keyManager.activeItem?.menuItem().parent ?? null,
                direction: "left"
            });
        } else {
            this.contextMenuData.navigate.emit({
                previousItem: this.keyManager.activeItem?.menuItem() ?? null,
                currentItem: null,
                direction: "left"
            });
        }
    }

    private handleArrowRightKey(): void {
        const menuItem = this.keyManager.activeItem?.menuItem();
        if (menuItem?.subMenuItems && menuItem.subMenuItems.length > 0) {
            this.menuPopupRef()?.close();
            const previousItem = this.keyManager.activeItem;
            if (this.keyManager.activeItem) {
                this.create(this.keyManager.activeItem.elementRef.nativeElement, menuItem, true);
            }
            this.contextMenuData.navigate.emit({
                previousItem: previousItem?.menuItem() ?? null,
                currentItem:
                    this.keyManager.activeItem?.menuItem().subMenuItems?.find(mi => !mi.disabled && !mi.divider) ??
                    null,
                direction: "right"
            });
        } else {
            this.contextMenuData.navigate.emit({
                previousItem: menuItem ?? null,
                currentItem: null,
                direction: "right"
            });
        }
    }

    private handleInputKeys(): void {
        const menuItem = this.keyManager.activeItem?.menuItem();
        if (menuItem) {
            if (menuItem.subMenuItems && menuItem.subMenuItems.length > 0) {
                return;
            }
            if (this.keyManager.activeItem) {
                this.keyManager.activeItem.menuItem().menuClick?.();
                this.contextMenuData.menuClick?.next(this.keyManager.activeItem.menuItem());
            }
        }
    }

    private handleVerticalArrowKeys(event: KeyboardEvent): void {
        const previousItem = this.keyManager.activeItem;
        this.keyManager.onKeydown(event);
        if (this.keyManager.activeItem !== previousItem) {
            this.contextMenuData.navigate.emit({
                previousItem: previousItem?.menuItem() ?? null,
                currentItem: this.keyManager.activeItem?.menuItem() ?? null,
                direction: event.key === "ArrowDown" ? "down" : "up"
            });
        }
    }

    private setEventListeners(): void {
        fromEvent<KeyboardEvent>(this.#hostElementRef.nativeElement, "keydown")
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
                switch (event.key) {
                    case "ArrowDown":
                    case "ArrowUp":
                        this.handleVerticalArrowKeys(event);
                        break;
                    case "Enter":
                    case " ":
                        this.handleInputKeys();
                        break;
                    case "ArrowRight":
                        this.handleArrowRightKey();
                        break;
                    case "ArrowLeft":
                        this.handleArrowLeftKey();
                        break;
                }
                this.#cdr.markForCheck();
            });
    }
}
