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

@Component({
    selector: "mona-contextmenu",
    templateUrl: "./context-menu.component.html",
    styleUrls: ["./context-menu.component.scss"]
})
export class ContextMenuComponent implements OnInit, OnDestroy, AfterContentInit {
    private readonly componentDestroy$: Subject<void> = new Subject<void>();
    private contextMenuRef: PopupRef | null = null;
    private menuClickNotifier: Subject<MenuItem> = new Subject<MenuItem>();
    private precise: boolean = true;
    private submenuCloseNotifier: Subject<void> = new Subject();
    private targetListener: () => void = () => void 0;

    public menuItems: MenuItem[] = [];

    @ContentChildren(MenuItemComponent)
    public menuItemComponents: QueryList<MenuItemComponent> = new QueryList<MenuItemComponent>();

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
        this.menuItems = this.menuItemComponents.map(m => m.getMenuItem()) ?? [];
        console.log(this.menuItems);
    }

    public ngOnDestroy(): void {
        this.targetListener?.();
        this.submenuCloseNotifier.next();
        this.submenuCloseNotifier.complete();
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
                menuItems: this.menuItems,
                parentClose: this.submenuCloseNotifier
            } as ContextMenuInjectorData,
            minWidth: this.minWidth,
            offset: this.offset,
            popupClass: ["mona-contextmenu-content"],
            width: this.width
        });
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
        });
        if (this.contextMenuRef) {
            this.contextMenuRef.closed.subscribe(() => {
                this.submenuCloseNotifier.next();
                this.submenuCloseNotifier.complete();
                this.targetListener();
            });
        }
        this.menuClickNotifier.pipe(takeUntil(this.componentDestroy$)).subscribe(() => {
            this.contextMenuRef?.close();
            this.submenuCloseNotifier.next();
        });
    }
}
