import { CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf } from "@angular/cdk/scrolling";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    ContentChild,
    DestroyRef,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
    Signal,
    signal,
    TemplateRef,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Enumerable, List } from "@mirei/ts-collections";
import { filter, fromEvent, map, tap } from "rxjs";
import { PageChangeEvent } from "../../../pager/models/PageChangeEvent";
import { PageSizeChangeEvent } from "../../../pager/models/PageSizeChangeEvent";
import { ListViewFooterTemplateDirective } from "../../directives/list-view-footer-template.directive";
import { ListViewGroupTemplateDirective } from "../../directives/list-view-group-template.directive";
import { ListViewHeaderTemplateDirective } from "../../directives/list-view-header-template.directive";
import { ListViewItemTemplateDirective } from "../../directives/list-view-item-template.directive";
import { ListViewItem } from "../../models/ListViewItem";
import { ListViewItemTemplateContext } from "../../models/ListViewItemTemplateContext";
import { NavigableOptions } from "../../models/NavigableOptions";
import { PagerSettings } from "../../models/PagerSettings";
import { PageState } from "../../models/PageState";
import { ListViewService } from "../../services/list-view.service";
import { PagerComponent } from "../../../pager/components/pager/pager.component";
import { NgIf, NgTemplateOutlet, NgFor } from "@angular/common";

@Component({
    selector: "mona-list-view",
    templateUrl: "./list-view.component.html",
    styleUrls: ["./list-view.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ListViewService],
    standalone: true,
    imports: [NgIf, NgTemplateOutlet, CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf, NgFor, PagerComponent]
})
export class ListViewComponent<T = any> implements OnInit, AfterViewInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    #items: Iterable<T> = [];
    #lastFocusedItem: ListViewItem<T> | null = null;
    public itemCount: Signal<number> = signal(0);
    public navigableOptions: NavigableOptions = {
        enabled: false,
        mode: "focus"
    };
    public page: WritableSignal<number> = signal(1);
    public pageState: PageState = { page: signal(1), skip: signal(0), take: signal(10) };
    public pagerSettings: PagerSettings = {
        enabled: false,
        firstLast: false,
        info: true,
        pageSizeValues: true,
        previousNext: false,
        type: "numeric",
        visiblePages: 5
    };
    public viewItems: Signal<List<ListViewItem>> = signal<List<ListViewItem>>(new List<ListViewItem>([]));

    @Input()
    public groupField?: string;

    @ContentChild(ListViewGroupTemplateDirective, { read: TemplateRef })
    public listViewGroupTemplateRef: TemplateRef<any> | null = null;

    @ContentChild(ListViewFooterTemplateDirective, { read: TemplateRef })
    public listViewFooterTemplateRef: TemplateRef<any> | null = null;

    @ContentChild(ListViewHeaderTemplateDirective, { read: TemplateRef })
    public listViewHeaderTemplateRef: TemplateRef<any> | null = null;

    @Input()
    public set items(value: Iterable<T>) {
        this.#items = value;
        this.prepareListViewItems();
    }

    @ViewChild("listViewContent")
    public listViewContent!: ElementRef<HTMLDivElement>;

    @ContentChild(ListViewItemTemplateDirective, { read: TemplateRef })
    public listViewItemTemplateRef!: TemplateRef<ListViewItemTemplateContext>;

    @Input()
    public set navigable(value: boolean | Partial<NavigableOptions>) {
        if (typeof value === "boolean") {
            this.navigableOptions.enabled = value;
        } else {
            this.navigableOptions.enabled = true;
            Object.assign(this.navigableOptions, value);
        }
    }

    @Input()
    public pageSize: number = 5;

    @Input()
    public set pageable(value: boolean | PagerSettings) {
        if (typeof value === "boolean") {
            this.pagerSettings.enabled = value;
        } else {
            Object.assign(this.pagerSettings, value);
        }
    }

    @Output()
    public scrollBottom: EventEmitter<Event> = new EventEmitter<Event>();

    @ViewChild("virtualScrollViewport")
    public virtualScrollViewport: CdkVirtualScrollViewport | null = null;

    public constructor(
        private readonly elementRef: ElementRef<HTMLDivElement>,
        public readonly listViewService: ListViewService
    ) {}

    public ngAfterViewInit(): void {
        this.setScrollBottomEvent();
    }

    public ngOnInit(): void {
        this.setSubscriptions();
    }

    public onListItemClick(item: ListViewItem<T>): void {
        this.listViewService.toggleItemSelection(item);
        if (item.selected() && this.navigableOptions.mode === "focus") {
            this.viewItems()
                .where(i => !i.equals(item))
                .forEach(i => i.focused.set(false));
            item.focused.set(true);
        }
    }

    public onPageChange(event: PageChangeEvent): void {
        this.pageState.page.set(event.page);
        this.pageState.skip.set(event.skip);
    }

    public onPageSizeChange(event: PageSizeChangeEvent): void {
        this.pageState.page.set(1);
        this.pageState.skip.set(0);
        this.pageState.take.set(event.newPageSize);
    }

    private clearFocusedItem(): void {
        const focusedItem = this.viewItems().firstOrDefault(i => i.focused());
        if (focusedItem) {
            focusedItem.focused.set(false);
        }
    }

    private focusNextItem(): void {
        const focusedItem = this.viewItems().firstOrDefault(i => i.focused());
        if (focusedItem) {
            const nextItem = this.viewItems()
                .skipWhile(i => !i.equals(focusedItem))
                .skip(1)
                .firstOrDefault(i => !i.groupHeader);
            if (nextItem) {
                focusedItem.focused.set(false);
                nextItem.focused.set(true);
                this.#lastFocusedItem = nextItem;
            }
        } else {
            const firstItem =
                this.viewItems().firstOrDefault(i => !i.groupHeader && i.selected()) ??
                this.viewItems().firstOrDefault(i => !i.groupHeader);
            if (firstItem) {
                firstItem.focused.set(true);
                this.#lastFocusedItem = firstItem;
            }
        }
    }

    private focusPreviousItem(): void {
        const focusedItem = this.viewItems().firstOrDefault(i => i.focused());
        if (focusedItem) {
            const previousItem = this.viewItems()
                .reverse()
                .skipWhile(i => !i.equals(focusedItem))
                .skip(1)
                .firstOrDefault(i => !i.groupHeader);
            if (previousItem) {
                focusedItem.focused.set(false);
                previousItem.focused.set(true);
                this.#lastFocusedItem = previousItem;
            }
        } else {
            const firstItem =
                this.viewItems().firstOrDefault(i => !i.groupHeader && i.selected()) ??
                this.viewItems().firstOrDefault(i => !i.groupHeader);
            if (firstItem) {
                firstItem.focused.set(true);
                this.#lastFocusedItem = firstItem;
            }
        }
    }

    private groupDataItems(dataItems: Iterable<any>): List<ListViewItem> {
        let groupedItems: List<ListViewItem>;
        if (this.groupField) {
            const field = this.groupField as string;
            groupedItems = Enumerable.from(dataItems)
                .groupBy(item => (item as any)[field])
                .select(group => {
                    const header = new ListViewItem({
                        headerText: group.key
                    });
                    header.groupHeader = true;
                    return new List<ListViewItem>([
                        header,
                        ...group.source.select(item => new ListViewItem(item)).toList()
                    ]);
                })
                .selectMany(g => g)
                .toList();
        } else {
            groupedItems = Enumerable.from(dataItems)
                .select(item => new ListViewItem<T>(item))
                .toList();
        }
        return groupedItems;
    }

    private groupListItems(listItems: Iterable<ListViewItem>): List<ListViewItem> {
        let groupedItems: List<ListViewItem>;
        if (this.groupField) {
            const field = this.groupField as string;
            groupedItems = Enumerable.from(listItems)
                .groupBy(item => (item.data as any)[field])
                .select(group => {
                    const header = new ListViewItem({
                        headerText: group.key
                    });
                    header.groupHeader = true;
                    return new List<ListViewItem>([header, ...group.source.toList()]);
                })
                .selectMany(g => g)
                .toList();
        } else {
            groupedItems = new List<ListViewItem>(listItems);
        }
        return groupedItems;
    }

    private prepareListViewItems(): void {
        const groupedItems = this.groupDataItems(this.#items);
        this.listViewService.listViewItems.set(groupedItems);
        this.listViewService.loadSelectedKeys(this.listViewService.selectedKeys);
        if (this.#lastFocusedItem != null) {
            const item = this.viewItems().firstOrDefault(i => i.equals(this.#lastFocusedItem as ListViewItem));
            if (item) {
                item.focused.set(true);
            }
        }
    }

    private scrollToFocusedItem(): void {
        const focusedItem = this.viewItems().firstOrDefault(i => i.focused());
        if (focusedItem) {
            const focusedItemElement = this.elementRef.nativeElement.querySelector(
                `[data-item-index="${this.viewItems().indexOf(focusedItem)}"]`
            );
            if (focusedItemElement) {
                focusedItemElement.scrollIntoView({
                    behavior: "auto",
                    block: "center"
                });
            }
        }
    }

    private scrollToSelectedItem(): void {
        const selectedItem = this.viewItems().firstOrDefault(i => i.selected());
        if (selectedItem) {
            const selectedItemElement = this.elementRef.nativeElement.querySelector(
                `[data-item-index="${this.viewItems().indexOf(selectedItem)}"]`
            );
            if (selectedItemElement) {
                selectedItemElement.scrollIntoView({
                    behavior: "auto",
                    block: "center"
                });
            }
        }
    }

    private selectNextItem(): void {
        const selectedItem = this.viewItems().firstOrDefault(i => i.selected());
        if (selectedItem) {
            const nextItem = this.viewItems()
                .skipWhile(i => !i.equals(selectedItem))
                .skip(1)
                .firstOrDefault(i => !i.groupHeader);
            if (nextItem) {
                this.listViewService.toggleItemSelection(selectedItem, false);
                this.listViewService.toggleItemSelection(nextItem);
            }
        } else {
            const firstItem =
                this.viewItems().firstOrDefault(i => !i.groupHeader && i.selected()) ??
                this.viewItems().firstOrDefault(i => !i.groupHeader);
            if (firstItem) {
                this.listViewService.toggleItemSelection(firstItem);
            }
        }
    }

    private selectPreviousItem(): void {
        const selectedItem = this.viewItems().firstOrDefault(i => i.selected());
        if (selectedItem) {
            const previousItem = this.viewItems()
                .reverse()
                .skipWhile(i => !i.equals(selectedItem))
                .skip(1)
                .firstOrDefault(i => !i.groupHeader);
            if (previousItem) {
                this.listViewService.toggleItemSelection(selectedItem, false);
                this.listViewService.toggleItemSelection(previousItem);
            }
        } else {
            const firstItem =
                this.viewItems().firstOrDefault(i => !i.groupHeader && i.selected()) ??
                this.viewItems().firstOrDefault(i => !i.groupHeader);
            if (firstItem) {
                this.listViewService.toggleItemSelection(firstItem);
            }
        }
    }

    private setKeyboardEvents(): void {
        fromEvent<KeyboardEvent>(this.elementRef.nativeElement, "keydown")
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                filter(
                    (event: KeyboardEvent) =>
                        event.key === "ArrowDown" ||
                        event.key === "ArrowUp" ||
                        event.key === "Enter" ||
                        event.key === " "
                ),
                tap((event: KeyboardEvent) => {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                }),
                map((event: KeyboardEvent) => event.key)
            )
            .subscribe((key: string) => {
                if (key === "ArrowDown" && this.navigableOptions.enabled) {
                    if (this.navigableOptions.mode === "focus") {
                        this.focusNextItem();
                        this.scrollToFocusedItem();
                    } else if (
                        this.navigableOptions.mode === "select" &&
                        this.listViewService.selectableOptions.enabled
                    ) {
                        this.selectNextItem();
                        this.scrollToSelectedItem();
                    }
                } else if (key === "ArrowUp" && this.navigableOptions.enabled) {
                    if (this.navigableOptions.mode === "focus") {
                        this.focusPreviousItem();
                        this.scrollToFocusedItem();
                    } else if (
                        this.navigableOptions.mode === "select" &&
                        this.listViewService.selectableOptions.enabled
                    ) {
                        this.selectPreviousItem();
                        this.scrollToSelectedItem();
                    }
                } else if (this.listViewService.selectableOptions.enabled && (key === "Enter" || key === " ")) {
                    const focusedItem = this.viewItems().firstOrDefault(i => i.focused());
                    if (focusedItem) {
                        this.listViewService.toggleItemSelection(focusedItem);
                    }
                }
            });
    }

    private setScrollBottomEvent(): void {
        const element = this.listViewService.virtualScrollOptions.enabled
            ? (this.virtualScrollViewport?.elementRef.nativeElement as HTMLElement)
            : this.listViewContent.nativeElement;
        fromEvent<Event>(element, "scroll")
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                filter(event => {
                    const target = event.target as HTMLElement;
                    return Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 3.0;
                }),
                tap((event: Event) => this.scrollBottom.emit(event))
            )
            .subscribe();
    }

    private setSubscriptions(): void {
        this.viewItems = computed(() => {
            const skip = this.pageState.skip();
            const take = this.pageState.take();
            if (!this.pagerSettings.enabled) {
                return this.listViewService.listViewItems();
            }
            const items = this.listViewService
                .listViewItems()
                .where(i => !i.groupHeader)
                .skip(skip)
                .take(take)
                .toList();
            return this.groupListItems(items);
        });
        this.itemCount = computed(() => {
            return this.listViewService.listViewItems().count();
        });

        if (this.navigableOptions.enabled || this.listViewService.selectableOptions.enabled) {
            this.setKeyboardEvents();
        }

        fromEvent<MouseEvent>(document, "click")
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                filter((event: MouseEvent) => {
                    const target = event.target as HTMLElement;
                    return !this.elementRef.nativeElement.contains(target);
                })
            )
            .subscribe(() => {
                this.clearFocusedItem();
            });
    }
}
