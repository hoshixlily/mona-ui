import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { NgTemplateOutlet } from "@angular/common";
import {
    afterNextRender,
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
    QueryList,
    Signal,
    signal,
    TemplateRef,
    ViewChildren,
    WritableSignal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Selector } from "@mirei/ts-collections";
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
import { ListItemTemplateContext } from "../../models/ListItemTemplateContext";
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
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent<TData> implements OnInit, AfterViewInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    #viewport: CdkVirtualScrollViewport | null = null;

    protected readonly listHeight: WritableSignal<string | undefined> = signal(undefined);
    protected readonly listMaxHeight: WritableSignal<string | undefined> = signal(undefined);
    protected readonly listWidth: WritableSignal<string | undefined> = signal(undefined);
    protected readonly viewportHeight: Signal<string | undefined> = computed(() => {
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

    @Input({ required: false })
    public set data(value: Iterable<TData>) {
        this.listService.setData(value);
    }

    @ContentChild(ListFooterTemplateDirective, { read: TemplateRef })
    public footerTemplate: TemplateRef<any> | null = null;

    @ContentChild(ListGroupHeaderTemplateDirective, { read: TemplateRef })
    public groupHeaderTemplate: TemplateRef<ListItemTemplateContext<string>> | null = null;

    @ContentChild(ListHeaderTemplateDirective, { read: TemplateRef })
    public headerTemplate: TemplateRef<any> | null = null;

    @Input()
    public set height(value: string | number | undefined) {
        if (value == null) {
            this.listHeight.set(undefined);
        } else if (typeof value === "number") {
            this.listHeight.set(`${value}px`);
        } else {
            this.listHeight.set(value);
        }
    }

    @Output()
    public itemSelect: EventEmitter<ListItem<TData>> = new EventEmitter<ListItem<TData>>();

    @ContentChild(ListItemTemplateDirective, { read: TemplateRef })
    public itemTemplate: TemplateRef<ListItemTemplateContext<TData>> | null = null;

    @Input()
    public set maxHeight(value: string | number | undefined) {
        if (value == null) {
            this.listMaxHeight.set(undefined);
        } else if (typeof value === "number") {
            this.listMaxHeight.set(`${value}px`);
        } else {
            this.listMaxHeight.set(value);
        }
    }

    @ContentChild(ListNoDataTemplateDirective, { read: TemplateRef })
    public noDataTemplate: TemplateRef<any> | null = null;

    @Input()
    public set textField(textField: string | Selector<TData, string> | null | undefined) {
        this.listService.setTextField(textField ?? "");
    }

    @ViewChildren(CdkVirtualScrollViewport)
    public virtualScrollViewport: QueryList<CdkVirtualScrollViewport> = new QueryList<CdkVirtualScrollViewport>();

    @Input()
    public set width(value: string | number | undefined) {
        if (value == null) {
            this.listWidth.set(undefined);
        } else if (typeof value === "number") {
            this.listWidth.set(`${value}px`);
        } else {
            this.listWidth.set(value);
        }
    }

    public constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        protected readonly listService: ListService<TData>
    ) {
        afterNextRender(() => {
            window.setTimeout(() => {
                const selectedItem = this.listService.selectedListItems().lastOrDefault();
                if (selectedItem) {
                    this.scrollToItem(selectedItem);
                }
            });
        });
    }

    public ngAfterViewInit(): void {
        this.#viewport = this.virtualScrollViewport.first;
        this.virtualScrollViewport.changes.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(viewport => {
            this.#viewport = viewport.first;
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

    public onListItemSelect(item: ListItem<TData>): void {
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
        this.itemSelect.emit(item);
    }

    private scrollToItem(item: ListItem<TData>): void {
        const element = this.elementRef.nativeElement.querySelector(`[data-uid="${item.uid}"]`);
        if (element) {
            element.scrollIntoView({ block: "center", behavior: "auto" });
        } else {
            if (this.listService.virtualScrollOptions().enabled) {
                const index = this.listService.viewItems().toList().indexOf(item);
                this.#viewport?.scrollToIndex(index, "auto");
            }
        }
    }

    private setKeyboardEvents(): void {
        fromEvent<KeyboardEvent>(this.elementRef.nativeElement, "keydown")
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                filter(event => event.key === "Enter" || event.key === "NumPadEnter")
            )
            .subscribe(() => {
                const highlightedItem = this.listService.highlightedItem();
                const selectedItem = this.listService.selectedListItems().firstOrDefault();
                if (highlightedItem) {
                    this.onListItemSelect(highlightedItem);
                } else if (selectedItem) {
                    this.listService.selectedKeysChange.emit(this.listService.selectedKeys().toArray());
                    this.itemSelect.emit(selectedItem);
                }
            });
    }

    private setNavigationEvents(): void {
        fromEvent<KeyboardEvent>(this.elementRef.nativeElement, "keydown")
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
                    this.itemSelect.emit(item);
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
