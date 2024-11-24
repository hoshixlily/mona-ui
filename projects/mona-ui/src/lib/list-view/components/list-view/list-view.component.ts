import { NgTemplateOutlet } from "@angular/common";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    DestroyRef,
    effect,
    ElementRef,
    inject,
    input,
    output,
    signal,
    TemplateRef,
    untracked
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ImmutableSet } from "@mirei/ts-collections";
import { filter, fromEvent } from "rxjs";
import { ListComponent } from "../../../common/list/components/list/list.component";
import { ListFooterTemplateDirective } from "../../../common/list/directives/list-footer-template.directive";
import { ListGroupHeaderTemplateDirective } from "../../../common/list/directives/list-group-header-template.directive";
import { ListHeaderTemplateDirective } from "../../../common/list/directives/list-header-template.directive";
import { ListItemTemplateDirective } from "../../../common/list/directives/list-item-template.directive";
import { ListNoDataTemplateDirective } from "../../../common/list/directives/list-no-data-template.directive";
import { ListKeySelector } from "../../../common/list/models/ListSelectors";
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
import { PagerSettings } from "../../models/PagerSettings";
import { PageState } from "../../models/PageState";

@Component({
    selector: "mona-list-view",
    templateUrl: "./list-view.component.html",
    styleUrls: ["./list-view.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ListService],
    imports: [
        NgTemplateOutlet,
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
    readonly #destroyRef = inject(DestroyRef);
    readonly #hostElementRef = inject(ElementRef<HTMLDivElement>);
    readonly #scrollBottomEnabled = computed(() => {
        const pageableOptions = this.pagerSettings();
        return !pageableOptions.enabled;
    });

    protected readonly footerTemplate = contentChild(ListViewFooterTemplateDirective, { read: TemplateRef });
    protected readonly groupHeaderTemplate = contentChild(ListViewGroupHeaderTemplateDirective, { read: TemplateRef });
    protected readonly headerTemplate = contentChild(ListViewHeaderTemplateDirective, { read: TemplateRef });
    protected readonly itemCount = computed(() => this.items().size());
    protected readonly itemTemplate = contentChild(ListViewItemTemplateDirective, { read: TemplateRef });
    protected readonly listService = inject(ListService<T>);
    protected readonly noDataTemplate = contentChild(ListViewNoDataTemplateDirective, { read: TemplateRef });
    protected readonly pageState: PageState = { page: signal(1), skip: signal(0), take: signal(10) };
    protected readonly pagerSettings = signal<PagerSettings>({
        enabled: false,
        firstLast: false,
        info: true,
        pageSizeValues: true,
        previousNext: false,
        type: "numeric",
        visiblePages: 5
    });
    protected readonly viewItems = computed(() => {
        const items = this.items();
        const pageableOptions = this.pagerSettings();
        const skip = this.pageState.skip();
        const take = this.pageState.take();
        if (!pageableOptions.enabled) {
            return items;
        }
        return items.skip(skip).take(take).toImmutableSet();
    });

    public readonly scrollBottom = output<Event>();

    public height = input<ListSizeType, ListSizeInputType>("100%", {
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
    public items = input<ImmutableSet<T>, Iterable<T>>(ImmutableSet.create(), {
        transform: value => ImmutableSet.create(value)
    });
    public textField = input<ListKeySelector<T, string> | undefined>("");
    public width = input<ListSizeType, ListSizeInputType>("100%", {
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

    public constructor() {
        effect(() => {
            const textField = this.textField();
            untracked(() => this.listService.setTextField(textField ?? ""));
        });
    }

    public ngAfterViewInit(): void {
        window.setTimeout(() => {
            this.setScrollBottomEvent();
        });
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
        let element: HTMLElement | null;
        const virtualScrollEnabled = this.listService.virtualScrollOptions().enabled;
        if (virtualScrollEnabled) {
            element = this.#hostElementRef.nativeElement.querySelector(".cdk-virtual-scroll-viewport");
        } else {
            element = this.#hostElementRef.nativeElement.querySelector(".mona-list > ul");
        }
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
