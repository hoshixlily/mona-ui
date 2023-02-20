import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
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

@Component({
    selector: "mona-pager",
    templateUrl: "./pager.component.html",
    styleUrls: ["./pager.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PagerComponent implements OnInit, OnChanges {
    public readonly ellipsisIcon: IconDefinition = faEllipsis;
    public readonly firstPageIcon: IconDefinition = faAngleDoubleLeft;
    public readonly lastPageIcon: IconDefinition = faAngleDoubleRight;
    public readonly nextIcon: IconDefinition = faAngleRight;
    public readonly previousIcon: IconDefinition = faAngleLeft;
    public inputValue: number | null = null;
    public pageCount: number = 10;
    public page: number = 1;
    public pageSizeValueList: number[] = [];
    public pages: Page[] = [];
    public skipCount: number = 0;

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

    @Input()
    public previousNext: boolean = true;

    @Input()
    public set pageSizeValues(values: number[] | boolean) {
        if (values === false || (Array.isArray(values) && values.length === 0)) {
            this.pageSizeValueList = [];
            this.pageSize = 10;
        } else if (Array.isArray(values)) {
            this.pageSizeValueList = values;
            this.pageSize = values[0];
        } else {
            this.pageSizeValueList = [10, 20, 50, 100];
            this.pageSize = this.pageSizeValueList[0];
        }
    }

    @Input()
    public set skip(skip: number) {
        this.page = Math.floor(skip / this.pageSize) + 1;
        this.skipCount = skip;
        this.inputValue = this.page;
        this.preparePages(this.page, this.visiblePages, this.pageCount);
    }

    @Input()
    public total: number = 0;

    @Input()
    public type: "numeric" | "input" = "numeric";

    @Input()
    public visiblePages: number = 5;

    public constructor() {}

    public ngOnChanges(changes: SimpleChanges) {
        if (changes["pageSize"] || changes["total"]) {
            this.pageCount = Math.ceil(this.total / this.pageSize);
            this.preparePages(this.page, this.visiblePages, this.pageCount);
        }
        if (changes["visiblePages"]) {
            this.preparePages(this.page, this.visiblePages, this.pageCount);
        }
    }

    public ngOnInit(): void {
        this.inputValue = this.page;
        this.preparePages(this.page, this.visiblePages, this.pageCount);
    }

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
        this.pageSizeChange.emit(event);
        if (event.isDefaultPrevented()) {
            return;
        }
        this.pageSize = value;
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
}
