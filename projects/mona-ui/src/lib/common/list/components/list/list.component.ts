import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { NgTemplateOutlet } from "@angular/common";
import {
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    DestroyRef,
    effect,
    ElementRef,
    inject,
    input,
    OnInit,
    output,
    Signal,
    TemplateRef,
    untracked,
    viewChild
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { filter, fromEvent, tap } from "rxjs";
import { PlaceholderComponent } from "../../../../layout/placeholder/placeholder.component";
import { FilterInputComponent } from "../../../filter-input/components/filter-input/filter-input.component";
import { FilterChangeEvent } from "../../../filter-input/models/FilterChangeEvent";
import { ListFooterTemplateDirective } from "../../directives/list-footer-template.directive";
import { ListGroupHeaderTemplateDirective } from "../../directives/list-group-header-template.directive";
import { ListHeaderTemplateDirective } from "../../directives/list-header-template.directive";
import { ListItemTemplateDirective } from "../../directives/list-item-template.directive";
import { ListItemDirective } from "../../directives/list-item.directive";
import { ListNoDataTemplateDirective } from "../../directives/list-no-data-template.directive";
import { ListItem } from "../../models/ListItem";
import { ListKeySelector } from "../../models/ListSelectors";
import { ListSizeInputType, ListSizeType } from "../../models/ListSizeType";
import { SelectionChangeEvent } from "../../models/SelectionChangeEvent";
import { ListService } from "../../services/list.service";
import { ListItemComponent } from "../list-item/list-item.component";

@Component({
    selector: "mona-list",
    standalone: true,
    imports: [
        FilterInputComponent,
        ListItemComponent,
        NgTemplateOutlet,
        ListItemDirective,
        PlaceholderComponent,
        CdkVirtualScrollViewport,
        CdkFixedSizeVirtualScroll,
        CdkVirtualForOf
    ],
    templateUrl: "./list.component.html",
    styleUrl: "./list.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        "[class.mona-list]": "true",
        "[style.height]": "listHeight()",
        "[style.max-height]": "listMaxHeight()",
        "[style.width]": "listWidth()",
        "[attr.tabindex]": "-1"
    }
})
export class ListComponent<TData> implements OnInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);

    protected readonly footerTemplate = contentChild(ListFooterTemplateDirective, { read: TemplateRef });
    protected readonly groupHeaderTemplate = contentChild(ListGroupHeaderTemplateDirective, { read: TemplateRef });
    protected readonly headerTemplate = contentChild(ListHeaderTemplateDirective, { read: TemplateRef });
    protected readonly itemTemplate = contentChild(ListItemTemplateDirective, { read: TemplateRef });
    protected readonly listHeight: Signal<string | undefined> = computed(() => {
        const height = this.height();
        if (height == null) {
            return undefined;
        }
        if (typeof height === "number") {
            return `${height}px`;
        }
        return height;
    });
    protected readonly listMaxHeight: Signal<ListSizeType> = computed(() => {
        const maxHeight = this.maxHeight();
        if (maxHeight == null) {
            return undefined;
        }
        if (typeof maxHeight === "number") {
            return `${maxHeight}px`;
        }
        return maxHeight;
    });
    protected readonly listService: ListService<TData> = inject(ListService);
    protected readonly listWidth: Signal<ListSizeType> = computed(() => {
        const width = this.width();
        if (width == null) {
            return undefined;
        }
        if (typeof width === "number") {
            return `${width}px`;
        }
        return width;
    });
    protected readonly noDataTemplate = contentChild(ListNoDataTemplateDirective, { read: TemplateRef });
    protected readonly viewportHeight: Signal<ListSizeType> = computed(() => {
        const listHeight = this.listHeight();
        if (listHeight) {
            return listHeight;
        }
        const items = this.listService.viewItems().size();
        const headerItems = this.listService
            .viewItems()
            .where(i => !!i.header)
            .count();
        const itemHeight = this.listService.virtualScrollOptions().height;
        const height = items * itemHeight + headerItems * 2;
        return `${height}px`;
    });
    protected readonly virtualScrollViewport = viewChild(CdkVirtualScrollViewport);

    public readonly itemSelect = output<SelectionChangeEvent<TData>>();

    public data = input<Iterable<TData> | null | undefined>(null);
    public height = input<ListSizeInputType>(undefined);
    public maxHeight = input<ListSizeInputType>(undefined);
    public textField = input<ListKeySelector<TData, string> | undefined>(null);
    public width = input<ListSizeInputType>(undefined);

    public constructor() {
        effect(() => {
            const textField = this.textField();
            untracked(() => {
                if (textField != null) {
                    this.listService.setTextField(textField);
                }
            });
        });
        effect(() => {
            const data = this.data();
            untracked(() => {
                if (data != null) {
                    this.listService.setData(data);
                }
            });
        });
        afterNextRender(() => {
            window.setTimeout(() => {
                const selectedItem = this.listService.selectedListItems().lastOrDefault();
                if (selectedItem) {
                    this.scrollToItem(selectedItem);
                }
            });
        });
    }

    public ngOnInit(): void {
        this.setSubscriptions();
    }

    public onFilterChange(event: FilterChangeEvent): void {
        this.listService.filterChange.emit(event);
        if (!event.isDefaultPrevented()) {
            this.listService.setFilter(event.filter);
        }
    }

    public onListItemClick(item: ListItem<TData>): void {
        this.selectItem(item);
        this.itemSelect.emit({ item, source: { source: "mouse" } });
    }

    private scrollToItem(item: ListItem<TData>): void {
        const element = this.#hostElementRef.nativeElement.querySelector(`[data-uid="${item.uid}"]`);
        if (element) {
            element.scrollIntoView({ block: "center", behavior: "auto" });
        } else if (this.listService.virtualScrollOptions().enabled) {
            const index = this.listService.viewItems().toList().indexOf(item);
            this.virtualScrollViewport()?.scrollToIndex(index, "auto");
        }
    }

    private selectItem(item: ListItem<TData>): void {
        const selectedItem = this.listService.selectedListItems();
        const options = this.listService.selectableOptions();

        if (
            (options.mode === "single" && !selectedItem.contains(item)) ||
            (options.mode === "single" && options.toggleable) ||
            options.mode === "multiple" ||
            (options.mode === "single" && selectedItem.size() > 1)
        ) {
            this.listService.selectItem(item);
            this.listService.selectedKeysChange.emit(this.listService.selectedKeys().toArray());
        }
    }

    private setKeyboardEvents(): void {
        fromEvent<KeyboardEvent>(this.#hostElementRef.nativeElement, "keydown")
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                filter(event => event.key === "Enter" || event.key === "NumPadEnter")
            )
            .subscribe((event: KeyboardEvent) => {
                const highlightedItem = this.listService.highlightedItem();
                const selectedItem = this.listService.selectedListItems().firstOrDefault();
                if (highlightedItem) {
                    this.selectItem(highlightedItem);
                    this.itemSelect.emit({ item: highlightedItem, source: { source: "keyboard", key: event.key } });
                } else if (selectedItem) {
                    this.listService.selectedKeysChange.emit(this.listService.selectedKeys().toArray());
                    this.itemSelect.emit({ item: selectedItem, source: { source: "keyboard", key: event.key } });
                }
            });
    }

    private setNavigationEvents(): void {
        fromEvent<KeyboardEvent>(this.#hostElementRef.nativeElement, "keydown")
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                filter(event => event.key === "ArrowDown" || event.key === "ArrowUp"),
                tap(event => {
                    const navigableOptions = this.listService.navigableOptions();
                    if (navigableOptions.enabled) {
                        event.preventDefault();
                    }
                })
            )
            .subscribe(event => {
                const navigableOptions = this.listService.navigableOptions();
                const previousSelectedItems = this.listService.selectedListItems();
                let item: ListItem<TData> | null = null;
                if (event.key === "ArrowDown") {
                    item = this.listService.navigate("next", navigableOptions.mode);
                } else if (event.key === "ArrowUp") {
                    item = this.listService.navigate("previous", navigableOptions.mode);
                }
                if (item) {
                    this.itemSelect.emit({ item, source: { source: "keyboard", key: event.key } });
                }
                if (item /* && navigableOptions.mode === "select"*/) {
                    if (previousSelectedItems.contains(item)) {
                        return;
                    }
                    this.listService.selectedKeysChange.emit(this.listService.selectedKeys().toArray());
                }
            });
    }

    private setSubscriptions(): void {
        this.setNavigationEvents();
        this.setKeyboardEvents();
        this.listService.scrollToItem$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(item => this.scrollToItem(item));
    }
}
