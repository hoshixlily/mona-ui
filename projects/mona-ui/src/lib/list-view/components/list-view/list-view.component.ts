import {
    ChangeDetectionStrategy,
    Component,
    computed,
    ContentChild,
    ElementRef,
    Input,
    OnInit,
    Signal,
    signal,
    TemplateRef,
    WritableSignal
} from "@angular/core";
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
import { PagerSettings } from "../../models/PagerSettings";
import { PageState } from "../../models/PageState";
import { ListViewService } from "../../services/list-view.service";

@Component({
    selector: "mona-list-view",
    templateUrl: "./list-view.component.html",
    styleUrls: ["./list-view.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ListViewService]
})
export class ListViewComponent<T = any> implements OnInit {
    #items: Iterable<T> = [];
    public itemCount: Signal<number> = signal(0);
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

    @ContentChild(ListViewItemTemplateDirective, { read: TemplateRef })
    public listViewItemTemplateRef!: TemplateRef<ListViewItemTemplateContext>;

    @Input()
    public navigable: boolean = false;

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

    public constructor(
        private readonly elementRef: ElementRef<HTMLDivElement>,
        public readonly listViewService: ListViewService
    ) {}

    public ngOnInit(): void {
        this.setSubscriptions();
    }

    public onListItemClick(item: ListViewItem<T>): void {
        this.listViewService.toggleItemSelection(item);
        if (item.selected()) {
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
            }
        } else {
            const firstItem =
                this.viewItems().firstOrDefault(i => !i.groupHeader && i.selected()) ??
                this.viewItems().firstOrDefault(i => !i.groupHeader);
            if (firstItem) {
                firstItem.focused.set(true);
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
            }
        } else {
            const firstItem =
                this.viewItems().firstOrDefault(i => !i.groupHeader && i.selected()) ??
                this.viewItems().firstOrDefault(i => !i.groupHeader);
            if (firstItem) {
                firstItem.focused.set(true);
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
        this.listViewService.loadSelectedKeys(this.listViewService.selectedKeys);
        this.listViewService.listViewItems.set(groupedItems);
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

    private setKeyboardNavigation(): void {
        fromEvent<KeyboardEvent>(this.elementRef.nativeElement, "keydown")
            .pipe(
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
                if (key === "ArrowDown") {
                    this.focusNextItem();
                    this.scrollToFocusedItem();
                } else if (key === "ArrowUp") {
                    this.focusPreviousItem();
                    this.scrollToFocusedItem();
                } else if (key === "Enter" || key === " ") {
                    const focusedItem = this.viewItems().firstOrDefault(i => i.focused());
                    if (focusedItem) {
                        this.listViewService.toggleItemSelection(focusedItem);
                    }
                }
            });
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

        if (this.navigable) {
            this.setKeyboardNavigation();
        }

        fromEvent<MouseEvent>(document, "click")
            .pipe(
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
