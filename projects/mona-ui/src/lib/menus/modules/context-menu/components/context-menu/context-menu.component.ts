import {
    AfterContentInit,
    Component,
    ContentChildren,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    QueryList,
    Renderer2
} from "@angular/core";
import { FlexibleConnectedPositionStrategyOrigin } from "@angular/cdk/overlay";
import { ContextMenuService } from "../../services/context-menu.service";
import { ContextMenuContentComponent } from "../context-menu-content/context-menu-content.component";
import { MenuItem } from "../../models/MenuItem";
import { ContextMenuInjectorData } from "../../models/ContextMenuInjectorData";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { Subject, takeUntil } from "rxjs";
import { PopupOffset } from "../../../../../popup/models/PopupOffset";
import { MenuItemComponent } from "../../../shared-menu/components/menu-item/menu-item.component";
import { ContextMenuItem } from "../../models/ContextMenuItem";

@Component({
    selector: "mona-contextmenu",
    templateUrl: "./context-menu.component.html",
    styleUrls: ["./context-menu.component.scss"]
})
export class ContextMenuComponent implements OnInit, OnDestroy, AfterContentInit {
    private readonly componentDestroy$: Subject<void> = new Subject<void>();
    private contextMenuRef: PopupRef | null = null;
    private keyupListener: () => void = () => void 0;
    private menuClickNotifier: Subject<ContextMenuItem> = new Subject<ContextMenuItem>();
    private menuItemList: ContextMenuItem[] = [];
    private parentMenuCloseNotifier: Subject<void> = new Subject();
    private precise: boolean = true;
    private targetListener: () => void = () => void 0;

    @ContentChildren(MenuItemComponent)
    public menuItemComponents: QueryList<MenuItemComponent> = new QueryList<MenuItemComponent>();

    @Input()
    public menuItems: MenuItem[] = [];

    @Input()
    public minWidth?: number | string;

    @Input()
    public offset?: PopupOffset;

    @Input()
    public target!: FlexibleConnectedPositionStrategyOrigin;

    @Input()
    public trigger: string = "contextmenu";

    @Input()
    public width?: number | string;

    public constructor(
        private readonly contextMenuService: ContextMenuService,
        private readonly renderer: Renderer2,
        private zone: NgZone
    ) {}

    public ngAfterContentInit(): void {
        if (this.menuItems.length !== 0) {
            this.menuItemList = this.processMenuItems(this.menuItems);
            console.log(this.menuItemList);
            return;
        }
        const items = this.menuItemComponents.map<ContextMenuItem>(m => m.getMenuItem());
        this.menuItemList = this.processMenuItems(items);
        console.log(this.menuItemList);
    }

    public ngOnDestroy(): void {
        this.targetListener?.();
        this.parentMenuCloseNotifier.next();
        this.parentMenuCloseNotifier.complete();
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public ngOnInit(): void {
        this.setEventListeners();
    }

    public setPrecise(precise: boolean): void {
        this.precise = precise;
    }

    private create(event: PointerEvent): void {
        this.contextMenuRef = this.contextMenuService.open({
            anchor: this.precise ? { x: event.x, y: event.y } : this.target,
            content: ContextMenuContentComponent,
            data: {
                menuClick: this.menuClickNotifier,
                menuItems: this.menuItemList,
                parentClose: this.parentMenuCloseNotifier
            } as ContextMenuInjectorData,
            minWidth: this.minWidth,
            offset: this.offset,
            popupClass: ["mona-contextmenu-content"],
            width: this.width
        });
        this.contextMenuRef.closed.subscribe(() => {
            this.parentMenuCloseNotifier.next();
            this.parentMenuCloseNotifier.complete();
            this.keyupListener();
            this.traverseMenuItems(this.menuItemList, (menuItem: ContextMenuItem) => {
                menuItem.focused = false;
            });
        });
    }

    private processMenuItems(menuItems: MenuItem[]): ContextMenuItem[] {
        if (!menuItems || menuItems.length === 0) {
            return [];
        }
        const items: ContextMenuItem[] = [];
        for (const item of menuItems) {
            if (item.subMenuItems && item.subMenuItems.length > 0) {
                items.push({
                    ...item,
                    focused: false,
                    subMenuItems: this.processMenuItems(item.subMenuItems)
                });
            } else {
                items.push({
                    ...item,
                    focused: false
                });
            }
        }
        return items;
    }

    private setEventListeners(): void {
        this.zone.runOutsideAngular(() => {
            this.targetListener = this.renderer.listen(this.target, this.trigger, (event: PointerEvent) => {
                event.stopPropagation();
                event.preventDefault();
                this.zone.run(() => {
                    this.create(event);
                });
            });
            this.keyupListener = this.renderer.listen("document", "keyup", (event: KeyboardEvent) => {
                if (event.key === "Escape") {
                    this.zone.run(() => {
                        this.contextMenuRef?.close();
                    });
                }
            });
        });
        this.menuClickNotifier.pipe(takeUntil(this.componentDestroy$)).subscribe(() => {
            this.contextMenuRef?.close();
            this.parentMenuCloseNotifier.next();
        });
    }

    private traverseMenuItems(menuItems: ContextMenuItem[], action: (menuItem: ContextMenuItem) => void): void {
        for (const menuItem of menuItems) {
            action(menuItem);
            if (menuItem.subMenuItems && menuItem.subMenuItems.length > 0) {
                this.traverseMenuItems(menuItem.subMenuItems, action);
            }
        }
    }
}
