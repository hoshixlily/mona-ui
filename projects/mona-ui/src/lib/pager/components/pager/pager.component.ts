import { NgClass } from "@angular/common";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Signal,
    signal,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
    faAngleDoubleLeft,
    faAngleDoubleRight,
    faAngleLeft,
    faAngleRight,
    faEllipsis,
    IconDefinition
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
    ]
})
export class PagerComponent implements OnInit, AfterViewInit, OnDestroy {
    #skip: WritableSignal<number> = signal(0);
    #widthObserver: ResizeObserver | null = null;
    private previousPageSize: number = 10;
    public readonly ellipsisIcon: IconDefinition = faEllipsis;
    public readonly firstPageIcon: IconDefinition = faAngleDoubleLeft;
    public readonly lastPageIcon: IconDefinition = faAngleDoubleRight;
    public readonly nextIcon: IconDefinition = faAngleRight;
    public readonly previousIcon: IconDefinition = faAngleLeft;
    public currentPageDataCountEnd: Signal<number> = computed(() => {
        return Math.min(this.page() * this.pagerPageSize(), this.totalPages());
    });
    public currentPageDataCountStart: Signal<number> = computed(() => {
        return (this.page() - 1) * this.pagerPageSize() + 1;
    });
    public infoVisible: WritableSignal<boolean> = signal(true);
    public inputValue: WritableSignal<number> = signal(1);
    public nextJumperVisible: Signal<boolean> = computed(
        () =>
            this.pages().length > this.visiblePageCount() &&
            this.pages()[this.pages().length - 1].page - this.pages()[this.pages().length - 2].page > 1
    );
    public page: Signal<number> = computed(() => Math.floor(this.#skip() / this.pagerPageSize()) + 1);
    public pageCount: Signal<number> = computed(() => Math.ceil(this.totalPages() / this.pagerPageSize()));
    public pageInputVisible: WritableSignal<boolean> = signal(true);
    public pageList: Signal<number[]> = computed(() => {
        return range(1, this.pageCount()).toArray();
    });
    public pageListVisible: WritableSignal<boolean> = signal(true);
    public pageSizeValueList: WritableSignal<number[]> = signal([]);
    public pagerInfo: Signal<string> = computed(() => {
        const start = (this.page() - 1) * this.pagerPageSize() + 1;
        const end = Math.min(this.page() * this.pagerPageSize(), this.totalPages());
        return `${start} - ${end} of ${this.totalPages()} items`;
    });
    public pagerPageSize: WritableSignal<number> = signal(10);
    public pages: Signal<Page[]> = computed(() => {
        return this.preparePages(this.page(), this.visiblePageCount(), this.pageCount());
    });
    public previousJumperVisible: Signal<boolean> = computed(
        () => this.pages().length > this.visiblePageCount() && this.pages()[1].page - 1 > 1
    );
    public totalPages: WritableSignal<number> = signal(0);
    public visiblePageCount: WritableSignal<number> = signal(5);

    @Input()
    public firstLast: boolean = true;

    @Output()
    public pageChange: EventEmitter<PageChangeEvent> = new EventEmitter<PageChangeEvent>();

    @Input()
    public pageInput: boolean = false;

    @Input()
    public set pageSize(value: number) {
        if (value !== this.pagerPageSize()) {
            this.pagerPageSize.set(value);
            this.previousPageSize = value;
        }
    }

    @Output()
    public pageSizeChange: EventEmitter<PageSizeChangeEvent> = new EventEmitter<PageSizeChangeEvent>();

    @ViewChild("pageSizeDropdownList")
    public pageSizeDropdownList?: DropDownListComponent<number>;

    @Input()
    public previousNext: boolean = true;

    @Input()
    public responsive: boolean = true;

    @Input()
    public set pageSizeValues(values: number[] | boolean) {
        if (values === false || (Array.isArray(values) && values.length === 0)) {
            this.pageSizeValueList.set([]);
        } else if (Array.isArray(values)) {
            this.pageSizeValueList.set(values);
        } else {
            this.pageSizeValueList.set([5, 10, 20, 50, 100]);
        }
    }

    @Input()
    public set skip(value: number) {
        if (value !== this.#skip()) {
            this.#skip.set(value);
        }
    }

    @Input()
    public set total(value: number) {
        if (value !== this.totalPages()) {
            this.totalPages.set(value);
        }
    }

    @Input()
    public type: PagerType = "numeric";

    @Input()
    public set visiblePages(value: number) {
        if (value !== this.visiblePageCount()) {
            this.visiblePageCount.set(value);
        }
    }

    public constructor(private readonly elementRef: ElementRef<HTMLDivElement>) {}

    public ngAfterViewInit(): void {
        if (this.responsive) {
            this.#widthObserver = new ResizeObserver(() => {
                this.infoVisible.set(this.elementRef.nativeElement.clientWidth >= 790);
                this.pageInputVisible.set(this.elementRef.nativeElement.clientWidth >= 640);
                this.pageListVisible.set(this.elementRef.nativeElement.clientWidth >= 480);
            });
            this.#widthObserver.observe(this.elementRef.nativeElement);
        }
    }

    public ngOnDestroy(): void {
        if (this.#widthObserver) {
            this.#widthObserver.disconnect();
        }
    }

    public ngOnInit(): void {}

    public onJumpNextClick(): void {
        const page = Math.min(this.page() + this.visiblePageCount(), this.pageCount());
        this.setPage(page);
    }

    public onJumpPreviousClick(): void {
        const page = Math.max(this.page() - this.visiblePageCount(), 1);
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
        if (this.pageSizeDropdownList) {
            this.pageSizeDropdownList.setValue(this.previousPageSize);
        }

        this.pageSizeChange.emit(event);
        if (event.isDefaultPrevented()) {
            this.pagerPageSize.set(this.previousPageSize);
            if (this.pageSizeDropdownList) {
                this.pageSizeDropdownList.setValue(this.previousPageSize);
            }
            return;
        }
        this.previousPageSize = value;
        this.pagerPageSize.set(value);
        if (this.pageSizeDropdownList) {
            this.pageSizeDropdownList.setValue(value);
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
