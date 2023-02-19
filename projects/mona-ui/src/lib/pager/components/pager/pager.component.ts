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
import { faChevronLeft, faChevronRight, faEllipsis, IconDefinition } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "mona-pager",
    templateUrl: "./pager.component.html",
    styleUrls: ["./pager.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PagerComponent implements OnInit, OnChanges {
    public readonly ellipsisIcon: IconDefinition = faEllipsis;
    public readonly nextIcon: IconDefinition = faChevronRight;
    public readonly previousIcon: IconDefinition = faChevronLeft;

    public pages: Page[] = [];

    @Input()
    public max: number = 10;

    @Input()
    public visiblePages: number = 5;

    @Input()
    public page: number = 1;

    @Output()
    public pageChange: EventEmitter<number> = new EventEmitter<number>();

    public constructor() {}

    public ngOnChanges(changes: SimpleChanges) {
        if (changes["page"] && !changes["page"].isFirstChange()) {
            const page = +changes["page"].currentValue;
            this.preparePages(page, this.visiblePages, this.max);
        }
    }

    public ngOnInit(): void {
        this.preparePages(this.page, this.visiblePages, this.max);
    }

    public onJumpNextClick(): void {
        const page = Math.min(this.page + this.visiblePages, this.max);
        this.page = page;
        this.preparePages(page, this.visiblePages, this.max);
        this.notifyPageChange();
    }

    public onJumpPreviousClick(): void {
        const page = Math.max(this.page - this.visiblePages, 1);
        this.page = page;
        this.preparePages(page, this.visiblePages, this.max);
        this.notifyPageChange();
    }

    public onNextPageClick(): void {
        const page = Math.min(this.page + 1, this.max);
        this.page = page;
        this.preparePages(page, this.visiblePages, this.max);
        this.notifyPageChange();
    }

    public onPageClick(page: number): void {
        if (page === this.page) {
            return;
        }
        this.page = page;
        this.preparePages(page, this.visiblePages, this.max);
        this.notifyPageChange();
    }

    public onPreviousPageClick(): void {
        const page = Math.max(this.page - 1, 1);
        this.page = page;
        this.preparePages(page, this.visiblePages, this.max);
        this.notifyPageChange();
    }

    private notifyPageChange(): void {
        this.pageChange.emit(this.page);
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
}
