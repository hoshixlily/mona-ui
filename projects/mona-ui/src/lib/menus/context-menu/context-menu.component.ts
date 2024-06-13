import { Point } from "@angular/cdk/drag-drop";
import {
    ChangeDetectionStrategy,
    Component,
    contentChildren,
    DestroyRef,
    ElementRef,
    inject,
    input,
    InputSignal,
    InputSignalWithTransform,
    OnInit,
    output,
    OutputEmitterRef,
    signal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { any, ImmutableSet } from "@mirei/ts-collections";
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
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuComponent implements OnInit {
    readonly #contextMenuInjectorData: Partial<ContextMenuInjectorData> = { isRoot: true };
    readonly #contextMenuService: ContextMenuService = inject(ContextMenuService);
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #menuClickNotifier: Subject<MenuItem> = new Subject<MenuItem>();
    #contextMenuRef: PopupRef | null = null;
    #precise: boolean = true;

    protected readonly menuItemComponents = contentChildren(MenuItemComponent);
    protected readonly menuItemList = signal<ImmutableSet<MenuItem>>(ImmutableSet.create());

    public readonly uid: string = v4();

    public readonly close: OutputEmitterRef<ContextMenuCloseEvent> = output();
    public readonly navigate: OutputEmitterRef<ContextMenuNavigationEvent> = output();
    public readonly open: OutputEmitterRef<ContextMenuOpenEvent> = output();

    public menuItems = input<Iterable<MenuItem>>([]);
    public minWidth: InputSignalWithTransform<string | undefined, number | string | undefined> = input(undefined, {
        transform: (value: string | number | undefined) => {
            if (typeof value === "number") {
                return `${value}px`;
            }
            return value;
        }
    });
    public offset: InputSignal<PopupOffset | undefined> = input<PopupOffset | undefined>(undefined);
    public popupClass: InputSignalWithTransform<string[], string | string[]> = input([], {
        transform: (value: string | string[]) => {
            if (Array.isArray(value)) {
                return value;
            }
            return [value];
        }
    });
    public target: InputSignal<ElementRef | Element> = input.required<ElementRef | Element>();
    public trigger: InputSignal<string> = input("contextmenu");
    public width: InputSignalWithTransform<string | undefined, number | string | undefined> = input(undefined, {
        transform: (value: number | string | undefined) => {
            if (typeof value === "number") {
                return `${value}px`;
            }
            return value;
        }
    });

    public closeMenu(): void {
        this.#contextMenuRef?.close();
    }

    public ngOnInit(): void {
        this.setEventListeners();
    }

    public openMenu(): void {
        this.create(new MouseEvent("click"));
    }

    public setPrecise(precise: boolean): void {
        this.#precise = precise;
    }

    private create(event: MouseEvent): void {
        this.initMenuItems();

        this.#contextMenuInjectorData.menuClick = this.#menuClickNotifier;
        this.#contextMenuInjectorData.menuItems = this.menuItemList();
        this.#contextMenuInjectorData.navigate = this.navigate;
        this.#contextMenuInjectorData.popupClass = this.popupClass();

        const target = this.target();
        const anchorElement = target instanceof ElementRef ? target.nativeElement : target;
        let anchor: Point | Element;
        if (this.#precise) {
            if (event.button < 0) {
                const rect = anchorElement.getBoundingClientRect();
                anchor = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
            } else {
                anchor = { x: event.x, y: event.y };
            }
        } else {
            anchor = anchorElement;
        }
        this.#contextMenuRef = this.#contextMenuService.open({
            anchor,
            closeOnOutsideClick: true,
            content: ContextMenuContentComponent,
            data: this.#contextMenuInjectorData,
            minWidth: this.minWidth(),
            offset: this.offset(),
            popupClass: ["mona-contextmenu-content", ...this.popupClass()],
            width: this.width()
        });
        this.#contextMenuInjectorData.parentMenuRef = this.#contextMenuRef;
        this.open.emit({ uid: this.uid, popupRef: this.#contextMenuRef as PopupRef });
        this.#contextMenuRef.closed
            .pipe(take(1))
            .subscribe(() => this.close.emit({ uid: this.uid, popupRef: this.#contextMenuRef as PopupRef }));
    }

    private initMenuItems(): void {
        const menuItemComponents = this.menuItemComponents();
        if (any(this.menuItems())) {
            this.menuItemList.update(set => set.clear().addAll(this.menuItems()));
            return;
        }
        this.menuItemList.set(ImmutableSet.create(menuItemComponents.map(m => m.getMenuItem())));
    }

    private onOutsideClick(event: MouseEvent): void {
        if (!this.#contextMenuRef) {
            return;
        }
        if (this.#contextMenuRef.overlayRef.overlayElement?.contains(event.target as HTMLElement)) {
            return;
        }
        this.#contextMenuRef.close();
    }

    private setEventListeners(): void {
        const target = this.target();
        const eventTarget = target instanceof ElementRef ? target.nativeElement : target;
        fromEvent<MouseEvent>(eventTarget, this.trigger())
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
                    this.#contextMenuRef?.close();
                }
                if (event instanceof MouseEvent) {
                    this.onOutsideClick(event);
                }
            });

        this.#menuClickNotifier.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
            this.#contextMenuRef?.close();
        });
    }
}
