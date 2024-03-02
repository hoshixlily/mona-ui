import { Point } from "@angular/cdk/drag-drop";
import {
    AfterContentInit,
    Component,
    ContentChildren,
    DestroyRef,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
    QueryList
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { fromEvent, mergeWith, Subject, take } from "rxjs";
import { v4 } from "uuid";
import { PopupOffset } from "../../popup/models/PopupOffset";
import { PopupRef } from "../../popup/models/PopupRef";
import { ContextMenuContentComponent } from "../context-menu-content/context-menu-content.component";
import { MenuItemComponent } from "../menu-item/menu-item.component";
import { ContextMenuCloseEvent } from "../models/ContextMenuCloseEvent";
import { ContextMenuInjectorData } from "../models/ContextMenuInjectorData";
import { ContextMenuNavigationEvent } from "../models/ContextMenuNavigationEvent";
import { ContextMenuOpenEvent } from "../models/ContextMenuOpenEvent";
import { MenuItem } from "../models/MenuItem";
import { ContextMenuService } from "../services/context-menu.service";

@Component({
    selector: "mona-contextmenu",
    template: "",
    styleUrls: [],
    standalone: true
})
export class ContextMenuComponent implements OnInit, AfterContentInit {
    readonly #contextMenuService: ContextMenuService = inject(ContextMenuService);
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    private contextMenuInjectorData: Partial<ContextMenuInjectorData> = { isRoot: true };
    private contextMenuRef: PopupRef | null = null;
    private menuClickNotifier: Subject<MenuItem> = new Subject<MenuItem>();
    private precise: boolean = true;
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
    public target!: ElementRef | Element;

    @Input()
    public trigger: string = "contextmenu";

    @Input()
    public width?: number | string;

    public closeMenu(): void {
        this.contextMenuRef?.close();
    }

    public ngAfterContentInit(): void {
        if (this.menuItems.length !== 0) {
            return;
        }
        this.menuItems = this.menuItemComponents.map(m => m.getMenuItem()) ?? [];
    }

    public ngOnInit(): void {
        this.setEventListeners();
    }

    public openMenu(): void {
        this.create(new MouseEvent("click"));
    }

    public setPrecise(precise: boolean): void {
        this.precise = precise;
    }

    private create(event: MouseEvent): void {
        this.contextMenuInjectorData.menuClick = this.menuClickNotifier;
        this.contextMenuInjectorData.menuItems = this.menuItems;
        this.contextMenuInjectorData.navigate = this.navigate;
        this.contextMenuInjectorData.popupClass = this.popupClass;

        const anchorElement = this.target instanceof ElementRef ? this.target.nativeElement : this.target;
        let anchor: Point | Element;
        if (this.precise) {
            if (event.button < 0) {
                const rect = anchorElement.getBoundingClientRect();
                anchor = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
            } else {
                anchor = { x: event.x, y: event.y };
            }
        } else {
            anchor = anchorElement;
        }
        this.contextMenuRef = this.#contextMenuService.open({
            anchor,
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
        const eventTarget = this.target instanceof ElementRef ? this.target.nativeElement : this.target;
        fromEvent<MouseEvent>(eventTarget, this.trigger)
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(event => {
                event.stopPropagation();
                event.preventDefault();
                this.create(event);
            });
        fromEvent<MouseEvent>(window, "click")
            .pipe(
                mergeWith(
                    fromEvent<MouseEvent>(window, "contextmenu"),
                    fromEvent<MouseEvent>(window, "auxclick"),
                    fromEvent<MouseEvent>(window, "keydown")
                ),
                takeUntilDestroyed(this.#destroyRef)
            )
            .subscribe(event => {
                if (event instanceof KeyboardEvent && event.key === "Escape") {
                    this.contextMenuRef?.close();
                }
                if (event instanceof MouseEvent) {
                    this.onOutsideClick(event);
                }
            });

        this.menuClickNotifier.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
            this.contextMenuRef?.close();
        });
    }
}
