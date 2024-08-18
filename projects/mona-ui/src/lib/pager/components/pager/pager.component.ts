import { NgClass } from "@angular/common";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    input,
    OnDestroy,
    output,
    Signal,
    signal,
    untracked,
    viewChild
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
    faAngleDoubleLeft,
    faAngleDoubleRight,
    faAngleLeft,
    faAngleRight,
    faEllipsis
} from "@fortawesome/free-solid-svg-icons";
import { range } from "@mirei/ts-collections";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { DropDownVirtualScrollDirective } from "../../../dropdowns/directives/drop-down-virtual-scroll.directive";
import { DropDownListComponent } from "../../../dropdowns/drop-down-list/components/drop-down-list/drop-down-list.component";
import { NumericTextBoxComponent } from "../../../inputs/numeric-text-box/components/numeric-text-box/numeric-text-box.component";
import { SlicePipe } from "../../../pipes/slice.pipe";
import { Page } from "../../models/Page";
import { PageChangeEvent } from "../../models/PageChangeEvent";
import { PagerType } from "../../models/PagerType";
import { PageSizeChangeEvent } from "../../models/PageSizeChangeEvent";

@Component({
    selector: "mona-pager",
    templateUrl: "./pager.component.html",
    styleUrls: ["./pager.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        ButtonDirective,
        FontAwesomeModule,
        NgClass,
        NumericTextBoxComponent,
        FormsModule,
        DropDownListComponent,
        SlicePipe,
        DropDownVirtualScrollDirective
    ],
    host: {
        class: "mona-pager"
    }
})
export class PagerComponent implements AfterViewInit, OnDestroy {
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    readonly #skip = signal(0);
    #widthObserver: ResizeObserver | null = null;
    #previousPageSize = 10;
    protected readonly ellipsisIcon = faEllipsis;
    protected readonly firstPageIcon = faAngleDoubleLeft;
    protected readonly lastPageIcon = faAngleDoubleRight;
    protected readonly nextIcon = faAngleRight;
    protected readonly previousIcon = faAngleLeft;
    protected readonly currentPageDataCountEnd = computed(() => {
        return Math.min(this.page() * this.pagerPageSize(), this.total());
    });
    protected readonly currentPageDataCountStart = computed(() => {
        if (this.total() === 0) {
            return 0;
        }
        return (this.page() - 1) * this.pagerPageSize() + 1;
    });
    protected readonly infoVisible = signal(true);
    protected readonly inputValue = signal(1);
    protected readonly nextJumperVisible = computed(
        () =>
            this.pages().length > this.visiblePages() &&
            this.pages()[this.pages().length - 1].page - this.pages()[this.pages().length - 2].page > 1
    );
    protected readonly pageCount = computed(() => Math.ceil(this.total() / this.pagerPageSize()));
    protected readonly pageInputVisible = signal(true);
    protected readonly pageList = computed(() => {
        return range(1, this.pageCount()).toArray();
    });
    protected readonly pageListVisible = signal(true);
    protected readonly pageSizeDropdownList: Signal<DropDownListComponent<number> | undefined> =
        viewChild("pageSizeDropdownList");
    protected readonly pagerInfo = computed(() => {
        const start = (this.page() - 1) * this.pagerPageSize() + 1;
        const end = Math.min(this.page() * this.pagerPageSize(), this.total());
        return `${start} - ${end} of ${this.total()} items`;
    });
    protected readonly pages = computed(() => {
        return this.preparePages(this.page(), this.visiblePages(), this.pageCount());
    });
    protected readonly previousJumperVisible = computed(
        () => this.pages().length > this.visiblePages() && this.pages()[1].page - 1 > 1
    );

    public readonly page = computed(() => Math.floor(this.#skip() / this.pagerPageSize()) + 1);
    public readonly pageChange = output<PageChangeEvent>();
    public readonly pageSizeChange = output<PageSizeChangeEvent>();
    public readonly pagerPageSize = signal(10);
    public firstLast = input(true);
    public pageInput = input(false);
    public pageSize = input(10);
    public pageSizeValues = input([5, 10, 20, 50, 100], {
        transform: (value: number[] | boolean) => {
            if (value === false || (Array.isArray(value) && value.length === 0)) {
                return [];
            } else if (Array.isArray(value)) {
                return value;
            } else {
                return [5, 10, 20, 50, 100];
            }
        }
    });
    public previousNext = input(true);
    public responsive = input(true);
    public skip = input(0);
    public total = input(0);
    public type = input<PagerType>("numeric");
    public visiblePages = input(5);

    public constructor() {
        effect(() => {
            const pageSize = this.pageSize();
            untracked(() => {
                this.pagerPageSize.set(pageSize);
                this.#previousPageSize = pageSize;
            });
        });
        effect(() => {
            const skip = this.skip();
            untracked(() => this.#skip.set(skip));
        });
    }

    public ngAfterViewInit(): void {
        if (this.responsive()) {
            this.#widthObserver = new ResizeObserver(() => {
                this.infoVisible.set(this.#hostElementRef.nativeElement.clientWidth >= 790);
                this.pageInputVisible.set(this.#hostElementRef.nativeElement.clientWidth >= 640);
                this.pageListVisible.set(this.#hostElementRef.nativeElement.clientWidth >= 480);
            });
            this.#widthObserver.observe(this.#hostElementRef.nativeElement);
        }
    }

    public ngOnDestroy(): void {
        if (this.#widthObserver) {
            this.#widthObserver.disconnect();
        }
    }

    public onJumpNextClick(): void {
        const page = Math.min(this.page() + this.visiblePages(), this.pageCount());
        this.setPage(page);
    }

    public onJumpPreviousClick(): void {
        const page = Math.max(this.page() - this.visiblePages(), 1);
        this.setPage(page);
    }

    public onNextPageClick(): void {
        const page = Math.min(this.page() + 1, this.pageCount());
        this.setPage(page);
    }

    public onPageClick(page: number): void {
        if (page === this.page()) {
            return;
        }
        this.setPage(page);
    }

    public onPageInputBlur(): void {
        if (this.inputValue() === null || this.inputValue() === this.page()) {
            this.inputValue.set(this.page());
            return;
        }
        if (this.inputValue() < 1) {
            this.inputValue.set(1);
        } else if (this.inputValue() > this.pageCount()) {
            this.inputValue.set(this.pageCount());
        }
        this.setPage(this.inputValue());
    }

    public onPageSizeValueChange(value: number): void {
        if (value === this.pagerPageSize()) {
            return;
        }
        const event = new PageSizeChangeEvent(value, this.pagerPageSize());
        const pageSizeDropdownList = this.pageSizeDropdownList();
        if (pageSizeDropdownList) {
            pageSizeDropdownList.setValue(this.#previousPageSize);
        }

        this.pageSizeChange.emit(event);
        if (event.isDefaultPrevented()) {
            this.pagerPageSize.set(this.#previousPageSize);
            if (pageSizeDropdownList) {
                pageSizeDropdownList.setValue(this.#previousPageSize);
            }
            return;
        }
        this.#previousPageSize = value;
        this.pagerPageSize.set(value);
        if (pageSizeDropdownList) {
            pageSizeDropdownList.setValue(value);
        }
        this.setPage(1);
    }

    public onPreviousPageClick(): void {
        const page = Math.max(this.page() - 1, 1);
        this.setPage(page);
    }

    private preparePages(currentPage: number, visiblePages: number, maxPages: number): Page[] {
        const half = Math.floor(visiblePages / 2);
        let first = 1;
        let index = 0;
        const pages: Page[] = [];
        if (maxPages <= 10) {
            for (index = 1; index <= maxPages; index++) {
                pages.push({ page: index, text: index.toString() });
            }
        } else if (currentPage < visiblePages) {
            pages.push({ page: first, text: first.toString() });
            for (index = 2; index < (maxPages < visiblePages ? maxPages : visiblePages) + 1; index++) {
                pages.push({ page: index, text: index.toString() });
            }
            pages.push({ page: maxPages, text: maxPages.toString() });
        } else if (currentPage >= visiblePages && currentPage <= maxPages - visiblePages) {
            pages.push({ page: first, text: first.toString() });
            for (index = currentPage - half; index < currentPage + visiblePages - half; index++) {
                pages.push({ page: index, text: index.toString() });
            }
            pages.push({ page: maxPages, text: maxPages.toString() });
        } else if (currentPage >= maxPages - visiblePages) {
            pages.push({ page: first, text: first.toString() });
            index = maxPages - visiblePages < currentPage ? maxPages - visiblePages : currentPage;
            for (; index <= maxPages; index++) {
                pages.push({ page: index, text: index.toString() });
            }
        }
        return pages;
    }

    private setPage(page: number): void {
        this.#skip.set((page - 1) * this.pagerPageSize());
        this.inputValue.set(page);
        this.pageChange.emit({ page, skip: this.#skip(), take: this.pagerPageSize() });
    }
}
