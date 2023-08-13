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
import { Enumerable, IList, IndexableList } from "@mirei/ts-collections";
import { filter, fromEvent, map, tap } from "rxjs";
import { PageChangeEvent } from "../../../pager/models/PageChangeEvent";
import { PageSizeChangeEvent } from "../../../pager/models/PageSizeChangeEvent";
import { ListViewFooterTemplateDirective } from "../../directives/list-view-footer-template.directive";
import { ListViewHeaderTemplateDirective } from "../../directives/list-view-header-template.directive";
import { ListViewItemTemplateDirective } from "../../directives/list-view-item-template.directive";
import { ListViewItem } from "../../models/ListViewItem";
import { ListViewItemTemplateContext } from "../../models/ListViewItemTemplateContext";
import { PagerSettings } from "../../models/PagerSettings";
import { PageState } from "../../models/PageState";

@Component({
    selector: "mona-list-view",
    templateUrl: "./list-view.component.html",
    styleUrls: ["./list-view.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListViewComponent<T = any> implements OnInit {
    #items: Iterable<T> = [];
    public listViewItems: WritableSignal<IndexableList<ListViewItem<T>>> = signal<IndexableList<ListViewItem<T>>>(
        new IndexableList<ListViewItem<T>>()
    );
    public page: WritableSignal<number> = signal(1);
    public pageState: PageState = { page: signal(1), skip: signal(0), take: signal(10) };
    public pagerSettings: PagerSettings = {
        enabled: true,
        firstLast: false,
        info: true,
        pageSizeValues: true,
        previousNext: false,
        type: "numeric",
        visiblePages: 5
    };
    public viewItems: Signal<IList<ListViewItem<T>>> = signal<IndexableList<ListViewItem<T>>>(
        new IndexableList<ListViewItem<T>>()
    );

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
    public pageSize: number = 5;

    @Input()
    public set pageable(value: boolean | PagerSettings) {
        if (typeof value === "boolean") {
            this.pagerSettings.enabled = value;
        } else {
            Object.assign(this.pagerSettings, value);
        }
    }

    public constructor(private readonly elementRef: ElementRef<HTMLDivElement>) {}

    public ngOnInit(): void {
        // this.pageState.take.set(this.pageSize);
        this.setSubscriptions();
    }

    public onPageChange(event: PageChangeEvent): void {
        this.pageState.page.set(event.page);
        this.pageState.skip.set(event.skip);
        // this.pageState.take.set(event.take);
    }

    public onPageSizeChange(event: PageSizeChangeEvent): void {
        this.pageState.page.set(1);
        this.pageState.skip.set(0);
        this.pageState.take.set(event.newPageSize);
    }

    private focusNextItem(): void {
        const focusedItem = this.viewItems().firstOrDefault(i => i.focused());
        if (focusedItem) {
            const nextItem = this.viewItems().elementAtOrDefault(this.viewItems().indexOf(focusedItem) + 1);
            if (nextItem) {
                focusedItem.focused.set(false);
                nextItem.focused.set(true);
            }
        } else {
            const firstItem = this.viewItems().firstOrDefault();
            if (firstItem) {
                firstItem.focused.set(true);
            }
        }
    }

    private focusPreviousItem(): void {
        const focusedItem = this.viewItems().firstOrDefault(i => i.focused());
        if (focusedItem) {
            const previousItem = this.viewItems().elementAtOrDefault(this.viewItems().indexOf(focusedItem) - 1);
            if (previousItem) {
                focusedItem.focused.set(false);
                previousItem.focused.set(true);
            }
        } else {
            const lastItem = this.viewItems().lastOrDefault();
            if (lastItem) {
                lastItem.focused.set(true);
            }
        }
    }

    private prepareListViewItems(): void {
        this.listViewItems.set(
            Enumerable.from(this.#items)
                .select(item => new ListViewItem<T>(item))
                .toIndexableList()
        );
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

    private setSubscriptions(): void {
        this.viewItems = computed(() => {
            const skip = this.pageState.skip();
            const take = this.pageState.take();
            return this.listViewItems().skip(skip).take(take).toIndexableList();
        });

        fromEvent<KeyboardEvent>(this.elementRef.nativeElement, "keydown")
            .pipe(
                filter((event: KeyboardEvent) => event.key === "ArrowDown" || event.key === "ArrowUp"),
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
                }
            });
    }
}
