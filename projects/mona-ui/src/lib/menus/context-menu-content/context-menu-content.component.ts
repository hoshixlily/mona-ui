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
    signal,
    viewChildren
} from "@angular/core";
import { any } from "@mirei/ts-collections";
import { filter, fromEvent, Subject } from "rxjs";
import { AnimationService } from "../../animations/services/animation.service";
import { PopupDataInjectionToken } from "../../popup/models/PopupInjectionToken";
import { PopupRef } from "../../popup/models/PopupRef";
import { ContextMenuItemComponent } from "../context-menu-item/context-menu-item.component";
import { ContextMenuInjectorData, InternalMenuItemClickEvent } from "../models/ContextMenuInjectorData";
import { defaultSubMenuPositions } from "../models/ContextMenuSettings";
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
export class ContextMenuContentComponent<C> implements OnInit, AfterViewInit {
    readonly #animationService: AnimationService = inject(AnimationService);
    readonly #cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    readonly #contextMenuInjectorData: Partial<ContextMenuInjectorData<C>> = { isRoot: false };
    readonly #contextMenuService: ContextMenuService = inject(ContextMenuService);
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    #currentMenuItem: MenuItem | null = null;
    protected readonly contextMenuItemComponents = viewChildren(ContextMenuItemComponent);
    protected readonly iconSpaceVisible = signal(false);
    protected readonly linkSpaceVisible = signal(false);
    protected readonly menuPopupRef = signal<PopupRef | null>(null);
    public readonly contextMenuData: ContextMenuInjectorData<C> =
        inject<ContextMenuInjectorData>(PopupDataInjectionToken);
    public keyManager!: ActiveDescendantKeyManager<ContextMenuItemComponent>;

    public ngAfterViewInit(): void {
        this.animateEnter();
        this.keyManager = new ActiveDescendantKeyManager<ContextMenuItemComponent>(
            this.contextMenuItemComponents() as ContextMenuItemComponent[]
        )
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
        const clickEvent: InternalMenuItemClickEvent<C> = {
            context: this.contextMenuData.context,
            originalEvent: event
        };
        menuItem.menuClick?.(clickEvent);
        this.contextMenuData.menuClick?.next(clickEvent);
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
        this.#contextMenuInjectorData.context = this.contextMenuData.context;
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
            positions: defaultSubMenuPositions,
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

    private handleInputKeys(event: KeyboardEvent): void {
        const menuItem = this.keyManager.activeItem?.menuItem();
        if (menuItem) {
            if (menuItem.subMenuItems && menuItem.subMenuItems.length > 0) {
                return;
            }
            if (this.keyManager.activeItem) {
                const clickEvent: InternalMenuItemClickEvent<C> = {
                    context: this.contextMenuData.context,
                    originalEvent: event
                };
                this.keyManager.activeItem.menuItem().menuClick?.(clickEvent);
                this.contextMenuData.menuClick?.next(clickEvent);
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
                        this.handleInputKeys(event);
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
