import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { NgTemplateOutlet } from "@angular/common";
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
    input,
    Input,
    InputSignalWithTransform,
    Output,
    Signal,
    signal,
    TemplateRef,
    WritableSignal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ImmutableSet, Selector } from "@mirei/ts-collections";
import { filter, fromEvent } from "rxjs";
import { ListComponent } from "../../../common/list/components/list/list.component";
import { ListFooterTemplateDirective } from "../../../common/list/directives/list-footer-template.directive";
import { ListGroupHeaderTemplateDirective } from "../../../common/list/directives/list-group-header-template.directive";
import { ListHeaderTemplateDirective } from "../../../common/list/directives/list-header-template.directive";
import { ListItemTemplateDirective } from "../../../common/list/directives/list-item-template.directive";
import { ListNoDataTemplateDirective } from "../../../common/list/directives/list-no-data-template.directive";
import { ListSizeInputType, ListSizeType } from "../../../common/list/models/ListSizeType";
import { ListService } from "../../../common/list/services/list.service";
import { PagerComponent } from "../../../pager/components/pager/pager.component";
import { PageChangeEvent } from "../../../pager/models/PageChangeEvent";
import { PageSizeChangeEvent } from "../../../pager/models/PageSizeChangeEvent";
import { ListViewFooterTemplateDirective } from "../../directives/list-view-footer-template.directive";
import { ListViewGroupHeaderTemplateDirective } from "../../directives/list-view-group-header-template.directive";
import { ListViewHeaderTemplateDirective } from "../../directives/list-view-header-template.directive";
import { ListViewItemTemplateDirective } from "../../directives/list-view-item-template.directive";
import { ListViewNoDataTemplateDirective } from "../../directives/list-view-no-data-template.directive";
import { ListViewItemTemplateContext } from "../../models/ListViewItemTemplateContext";
import { PagerSettings } from "../../models/PagerSettings";
import { PageState } from "../../models/PageState";

@Component({
    selector: "mona-list-view",
    templateUrl: "./list-view.component.html",
    styleUrls: ["./list-view.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ListService],
    standalone: true,
    imports: [
        NgTemplateOutlet,
        CdkVirtualScrollViewport,
        CdkFixedSizeVirtualScroll,
        CdkVirtualForOf,
        PagerComponent,
        ListComponent,
        ListHeaderTemplateDirective,
        ListFooterTemplateDirective,
        ListGroupHeaderTemplateDirective,
        ListItemTemplateDirective,
        ListNoDataTemplateDirective
    ],
    host: {
        class: "mona-list-view",
        "[attr.tabindex]": "-1"
    }
})
export class ListViewComponent<T = any> implements AfterViewInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #hostElementRef: ElementRef<HTMLDivElement> = inject(ElementRef);
    readonly #scrollBottomEnabled: Signal<boolean> = computed(() => {
        const pageableOptions = this.pagerSettings();
        return !pageableOptions.enabled;
    });

    protected readonly itemCount: Signal<number> = computed(() => this.items().size());
    protected readonly pageState: PageState = { page: signal(1), skip: signal(0), take: signal(10) };
    protected readonly pagerSettings: WritableSignal<PagerSettings> = signal({
        enabled: false,
        firstLast: false,
        info: true,
        pageSizeValues: true,
        previousNext: false,
        type: "numeric",
        visiblePages: 5
    });
    protected readonly viewItems: Signal<ImmutableSet<T>> = computed(() => {
        const items = this.items();
        const pageableOptions = this.pagerSettings();
        const skip = this.pageState.skip();
        const take = this.pageState.take();
        if (!pageableOptions.enabled) {
            return items;
        }
        return items.skip(skip).take(take).toImmutableSet();
    });

    public height: InputSignalWithTransform<ListSizeType, ListSizeInputType> = input("100%", {
        transform: value => {
            if (value == null) {
                return undefined;
            } else if (typeof value === "number") {
                return `${value}px`;
            } else {
                return value;
            }
        }
    });
    public items: InputSignalWithTransform<ImmutableSet<T>, Iterable<T>> = input(ImmutableSet.create(), {
        transform: value => ImmutableSet.create(value)
    });
    public width: InputSignalWithTransform<ListSizeType, ListSizeInputType> = input("100%", {
        transform: value => {
            if (value == null) {
                return undefined;
            } else if (typeof value === "number") {
                return `${value}px`;
            } else {
                return value;
            }
        }
    });

    @ContentChild(ListViewFooterTemplateDirective, { read: TemplateRef })
    public footerTemplate: TemplateRef<any> | null = null;

    @ContentChild(ListViewGroupHeaderTemplateDirective, { read: TemplateRef })
    public groupHeaderTemplate: TemplateRef<any> | null = null;

    @ContentChild(ListViewHeaderTemplateDirective, { read: TemplateRef })
    public headerTemplate: TemplateRef<any> | null = null;

    @ContentChild(ListViewItemTemplateDirective, { read: TemplateRef })
    public itemTemplate!: TemplateRef<ListViewItemTemplateContext>;

    @ContentChild(ListViewNoDataTemplateDirective, { read: TemplateRef })
    public noDataTemplate: TemplateRef<any> | null = null;

    @Input()
    public pageSize: number = 5;

    @Output()
    public scrollBottom: EventEmitter<Event> = new EventEmitter<Event>();

    @Input()
    public set textField(textField: string | Selector<T, string> | null | undefined) {
        this.listService.setTextField(textField ?? "");
    }

    public constructor(protected readonly listService: ListService<T>) {}

    public ngAfterViewInit(): void {
        this.setScrollBottomEvent();
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

    public setPagerSettings(settings: PagerSettings): void {
        this.pagerSettings.set(settings);
    }

    private setScrollBottomEvent(): void {
        const element = this.listService.virtualScrollOptions().enabled
            ? this.#hostElementRef.nativeElement.querySelector(".cdk-virtual-scroll-viewport")
            : this.#hostElementRef.nativeElement.querySelector(".mona-list > ul");
        if (!element) {
            return;
        }
        fromEvent<Event>(element, "scroll")
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                filter(event => {
                    if (!this.#scrollBottomEnabled()) {
                        return false;
                    }
                    const target = event.target as HTMLElement;
                    return Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 3.0;
                })
            )
            .subscribe(event => this.scrollBottom.emit(event));
    }
}
