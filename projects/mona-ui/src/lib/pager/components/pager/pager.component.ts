import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    signal,
    SimpleChanges,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { Page } from "../../models/Page";
import {
    faAngleDoubleLeft,
    faAngleDoubleRight,
    faAngleLeft,
    faAngleRight,
    faEllipsis,
    IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { PageChangeEvent } from "../../models/PageChangeEvent";
import { PageSizeChangeEvent } from "../../models/PageSizeChangeEvent";
import { DropDownListComponent } from "../../../dropdowns/modules/drop-down-list/components/drop-down-list/drop-down-list.component";
import { Enumerable } from "@mirei/ts-collections";

@Component({
    selector: "mona-pager",
    templateUrl: "./pager.component.html",
    styleUrls: ["./pager.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PagerComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    #widthObserver: ResizeObserver | null = null;
    private previousPageSize: number = 10;
    public readonly ellipsisIcon: IconDefinition = faEllipsis;
    public readonly firstPageIcon: IconDefinition = faAngleDoubleLeft;
    public readonly lastPageIcon: IconDefinition = faAngleDoubleRight;
    public readonly nextIcon: IconDefinition = faAngleRight;
    public readonly previousIcon: IconDefinition = faAngleLeft;
    public infoVisible: WritableSignal<boolean> = signal(true);
    public inputValue: number | null = null;
    public page: number = 1;
    public pageCount: number = 10;
    public pageInputVisible: WritableSignal<boolean> = signal(true);
    public pageList: WritableSignal<number[]> = signal([]);
    public pageListVisible: WritableSignal<boolean> = signal(true);
    public pageSizeValueList: number[] = [];
    public pages: Page[] = [];

    @Input()
    public firstLast: boolean = true;

    @Output()
    public pageChange: EventEmitter<PageChangeEvent> = new EventEmitter<PageChangeEvent>();

    @Input()
    public pageInput: boolean = false;

    @Input()
    public pageSize: number = 10;

    @Output()
    public pageSizeChange: EventEmitter<PageSizeChangeEvent> = new EventEmitter<PageSizeChangeEvent>();

    @ViewChild("pageSizeDropdownList")
    public pageSizeDropdownList?: DropDownListComponent;

    @Input()
    public previousNext: boolean = true;

    @Input()
    public responsive: boolean = true;

    @Input()
    public set pageSizeValues(values: number[] | boolean) {
        if (values === false || (Array.isArray(values) && values.length === 0)) {
            this.pageSizeValueList = [];
        } else if (Array.isArray(values)) {
            this.pageSizeValueList = values;
        } else {
            this.pageSizeValueList = [10, 20, 50, 100];
        }
    }

    @Input()
    public skip: number = 0;

    @Input()
    public total: number = 0;

    @Input()
    public type: "numeric" | "input" = "numeric";

    @Input()
    public visiblePages: number = 5;

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

    public ngOnChanges(changes: SimpleChanges) {
        if (changes["pageSize"] || changes["total"] || changes["visiblePages"] || changes["skip"]) {
            const pageSize = changes["pageSize"] ? changes["pageSize"].currentValue : this.pageSize;
            const total = changes["total"] ? changes["total"].currentValue : this.total;
            const visiblePages = changes["visiblePages"] ? changes["visiblePages"].currentValue : this.visiblePages;
            this.pageCount = Math.ceil(total / pageSize);
            if (changes["skip"] && changes["skip"].currentValue !== changes["skip"].previousValue) {
                const skip = changes["skip"].currentValue;
                this.page = Math.floor(skip / pageSize) + 1 ?? this.page;
                this.inputValue = this.page;
            }
            this.pageCount = Math.ceil(total / pageSize);
            this.preparePages(this.page, visiblePages, this.pageCount);
        }
        this.pageList.set(Enumerable.range(1, this.pageCount).toArray());
    }

    public ngOnDestroy(): void {
        if (this.#widthObserver) {
            this.#widthObserver.disconnect();
        }
    }

    public ngOnInit(): void {}

    public onJumpNextClick(): void {
        const page = Math.min(this.page + this.visiblePages, this.pageCount);
        this.setPage(page);
    }

    public onJumpPreviousClick(): void {
        const page = Math.max(this.page - this.visiblePages, 1);
        this.setPage(page);
    }

    public onNextPageClick(): void {
        const page = Math.min(this.page + 1, this.pageCount);
        this.setPage(page);
    }

    public onPageClick(page: number): void {
        if (page === this.page) {
            return;
        }
        this.setPage(page);
    }

    public onPageInputBlur(): void {
        if (this.inputValue === null || this.inputValue === this.page) {
            this.inputValue = this.page;
            return;
        }
        if (this.inputValue < 1) {
            this.inputValue = 1;
        } else if (this.inputValue > this.pageCount) {
            this.inputValue = this.pageCount;
        }
        this.setPage(this.inputValue);
    }

    public onPageSizeValueChange(value: number): void {
        if (value === this.pageSize) {
            return;
        }
        const event = new PageSizeChangeEvent(value, this.pageSize);
        if (this.pageSizeDropdownList) {
            this.pageSizeDropdownList.setValue(this.previousPageSize);
        }

        this.pageSizeChange.emit(event);
        if (event.isDefaultPrevented()) {
            this.pageSize = this.previousPageSize;
            if (this.pageSizeDropdownList) {
                this.pageSizeDropdownList.setValue(this.previousPageSize);
            }
            return;
        }
        this.previousPageSize = value;
        if (this.pageSizeDropdownList) {
            this.pageSizeDropdownList.setValue(value);
        }
        this.pageCount = Math.ceil(this.total / this.pageSize);
        this.setPage(1);
    }

    public onPreviousPageClick(): void {
        const page = Math.max(this.page - 1, 1);
        this.setPage(page);
    }

    private preparePages(currentPage: number, visiblePages: number, maxPages: number): void {
        const half = Math.floor(visiblePages / 2);
        let first = 1;
        let index = 0;
        this.pages = [];
        if (maxPages <= 10) {
            for (index = 1; index <= maxPages; index++) {
                this.pages.push({ page: index, text: index.toString() });
            }
        } else if (currentPage < visiblePages) {
            this.pages.push({ page: first, text: first.toString() });
            for (index = 2; index < (maxPages < visiblePages ? maxPages : visiblePages) + 1; index++) {
                this.pages.push({ page: index, text: index.toString() });
            }
            this.pages.push({ page: maxPages, text: maxPages.toString() });
        } else if (currentPage >= visiblePages && currentPage <= maxPages - visiblePages) {
            this.pages.push({ page: first, text: first.toString() });
            for (index = currentPage - half; index < currentPage + visiblePages - half; index++) {
                this.pages.push({ page: index, text: index.toString() });
            }
            this.pages.push({ page: maxPages, text: maxPages.toString() });
        } else if (currentPage >= maxPages - visiblePages) {
            this.pages.push({ page: first, text: first.toString() });
            index = maxPages - visiblePages < currentPage ? maxPages - visiblePages : currentPage;
            for (; index <= maxPages; index++) {
                this.pages.push({ page: index, text: index.toString() });
            }
        }
    }

    private setPage(page: number): void {
        const skip = (page - 1) * this.pageSize;
        this.pageChange.emit({ page, skip, take: this.pageSize });
    }

    public get currentPageDataCountEnd(): number {
        return Math.min(this.page * this.pageSize, this.total);
    }

    public get currentPageDataCountStart(): number {
        return (this.page - 1) * this.pageSize + 1;
    }
}
