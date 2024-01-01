import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { NgTemplateOutlet } from "@angular/common";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    DestroyRef,
    ElementRef,
    inject,
    Input,
    OnInit,
    QueryList,
    TemplateRef,
    ViewChildren
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

    @ContentChild(ListItemTemplateDirective, { read: TemplateRef })
    public itemTemplate: TemplateRef<ListItemTemplateContext<TData>> | null = null;

    @ContentChild(ListNoDataTemplateDirective, { read: TemplateRef })
    public noDataTemplate: TemplateRef<any> | null = null;

    @Input()
    public set textField(textField: string | Selector<TData, string> | null | undefined) {
        this.listService.setTextField(textField ?? "");
    }

    @ViewChildren(CdkVirtualScrollViewport)
    public virtualScrollViewport: QueryList<CdkVirtualScrollViewport> = new QueryList<CdkVirtualScrollViewport>();

    public constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        protected readonly listService: ListService<TData>
    ) {}

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

    public onListItemClick(item: ListItem<TData>): void {
        this.listService.selectItem(item);
        this.listService.selectedKeysChange.emit(this.listService.selectedKeys());
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
                let item: ListItem<TData> | null = null;
                if (event.key === "ArrowDown") {
                    item = this.listService.navigate("next", navigableOptions.mode);
                } else if (event.key === "ArrowUp") {
                    item = this.listService.navigate("previous", navigableOptions.mode);
                }
                if (item) {
                    this.listService.selectedKeysChange.emit(this.listService.selectedKeys());
                }
            });
    }

    private setSubscriptions(): void {
        this.setNavigationEvents();
        this.listService.scrollToItem$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(item => this.scrollToItem(item));
    }
}
