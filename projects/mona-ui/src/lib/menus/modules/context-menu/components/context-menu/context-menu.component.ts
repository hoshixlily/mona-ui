import {
    AfterContentInit,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    Renderer2
} from "@angular/core";
import { FlexibleConnectedPositionStrategyOrigin } from "@angular/cdk/overlay";
import { ContextMenuService } from "../../services/context-menu.service";
import { ContextMenuContentComponent } from "../context-menu-content/context-menu-content.component";
import { MenuItem } from "../../models/MenuItem";
import { ContextMenuInjectorData } from "../../models/ContextMenuInjectorData";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { Subject, take, takeUntil } from "rxjs";
import { PopupOffset } from "../../../../../popup/models/PopupOffset";
import { MenuItemComponent } from "../../../shared-menu/components/menu-item/menu-item.component";
import { ContextMenuCloseEvent } from "../../models/ContextMenuCloseEvent";
import { v4 } from "uuid";
import { ContextMenuOpenEvent } from "../../models/ContextMenuOpenEvent";
import { ContextMenuNavigationEvent } from "../../models/ContextMenuNavigationEvent";

@Component({
    selector: "mona-contextmenu",
    templateUrl: "./context-menu.component.html",
    styleUrls: ["./context-menu.component.scss"]
})
export class ContextMenuComponent implements OnInit, OnDestroy, AfterContentInit {
    private readonly componentDestroy$: Subject<void> = new Subject<void>();
    private contextMenuInjectorData: Partial<ContextMenuInjectorData> = { isRoot: true };
    private contextMenuRef: PopupRef | null = null;
    private menuClickNotifier: Subject<MenuItem> = new Subject<MenuItem>();
    private precise: boolean = true;
    private targetListener: () => void = () => void 0;
    private windowEventListenerRefs: Array<() => void> = [];
    public readonly uid: string = v4();

    @Output()
    public close: EventEmitter<ContextMenuCloseEvent> = new EventEmitter<ContextMenuCloseEvent>();

    @ContentChildren(MenuItemComponent)
    public menuItemComponents: QueryList<MenuItemComponent> = new QueryList<MenuItemComponent>();

    @Input()
    public menuItems: MenuItem[] = [];

    @Input()
    public minWidth?: number | string;

    @Output()
    public navigate: EventEmitter<ContextMenuNavigationEvent> = new EventEmitter<ContextMenuNavigationEvent>();

    @Input()
    public offset?: PopupOffset;

    @Output()
    public open: EventEmitter<ContextMenuOpenEvent> = new EventEmitter<ContextMenuOpenEvent>();

    @Input()
    public popupClass: string | string[] = [];

    @Input()
    public target!: FlexibleConnectedPositionStrategyOrigin;

    @Input()
    public trigger: string = "contextmenu";

    @Input()
    public width?: number | string;

    public constructor(
        private readonly contextMenuService: ContextMenuService,
        private readonly elementRef: ElementRef,
        private readonly renderer: Renderer2,
        private readonly zone: NgZone
    ) {}

    public closeMenu(): void {
        this.contextMenuRef?.close();
    }

    public ngAfterContentInit(): void {
        if (this.menuItems.length !== 0) {
            return;
        }
        this.menuItems = this.menuItemComponents.map(m => m.getMenuItem()) ?? [];
    }

    public ngOnDestroy(): void {
        this.targetListener?.();
        this.windowEventListenerRefs.forEach(ref => ref());
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public ngOnInit(): void {
        this.setEventListeners();
    }

    public openMenu(): void {
        this.create(new MouseEvent("click") as PointerEvent);
    }

    public setPrecise(precise: boolean): void {
        this.precise = precise;
    }

    private create(event: PointerEvent): void {
        this.contextMenuInjectorData.menuClick = this.menuClickNotifier;
        this.contextMenuInjectorData.menuItems = this.menuItems;
        this.contextMenuInjectorData.navigate = this.navigate;
        this.contextMenuInjectorData.popupClass = this.popupClass;
        this.contextMenuRef = this.contextMenuService.open({
            anchor: this.precise ? { x: event.x, y: event.y } : this.target,
            closeOnOutsideClick: true,
            content: ContextMenuContentComponent,
            data: this.contextMenuInjectorData,
            minWidth: this.minWidth,
            offset: this.offset,
            popupClass: Array.isArray(this.popupClass)
                ? ["mona-contextmenu-content", ...this.popupClass]
                : ["mona-contextmenu-content", this.popupClass],
            width: this.width
        });
        this.contextMenuInjectorData.parentMenuRef = this.contextMenuRef;
        this.open.emit({ uid: this.uid, popupRef: this.contextMenuRef as PopupRef });
        this.contextMenuRef.closed
            .pipe(take(1))
            .subscribe(() => this.close.emit({ uid: this.uid, popupRef: this.contextMenuRef as PopupRef }));
    }

    private onOutsideClick(event: MouseEvent): void {
        if (!this.contextMenuRef) {
            return;
        }
        if (this.contextMenuRef.overlayRef.overlayElement?.contains(event.target as HTMLElement)) {
            return;
        }
        this.contextMenuRef.close();
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
            this.windowEventListenerRefs = [
                this.renderer.listen(window, "click", this.onOutsideClick.bind(this)),
                this.renderer.listen(window, "contextmenu", this.onOutsideClick.bind(this)),
                this.renderer.listen(window, "auxclick", this.onOutsideClick.bind(this)),
                this.renderer.listen(window, "keydown.esc", () => this.contextMenuRef?.close())
            ];
        });

        this.menuClickNotifier.pipe(takeUntil(this.componentDestroy$)).subscribe(() => {
            this.contextMenuRef?.close();
        });
    }
}
