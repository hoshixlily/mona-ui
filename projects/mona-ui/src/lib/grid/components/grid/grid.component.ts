import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild
} from "@angular/core";
import { GridService } from "../../services/grid.service";
import {
    faArrowDownLong,
    faArrowUpLong,
    faChevronDown,
    faChevronUp,
    IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { Column } from "../../models/Column";
import { SortDescriptor } from "../../../query/sort/SortDescriptor";
import { ColumnFilterState } from "../../models/ColumnFilterState";
import { PageSizeChangeEvent } from "../../../pager/models/PageSizeChangeEvent";
import { PageChangeEvent } from "../../../pager/models/PageChangeEvent";

@Component({
    selector: "mona-grid",
    templateUrl: "./grid.component.html",
    styleUrls: ["./grid.component.scss"],
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [GridService]
})
export class GridComponent implements OnInit, AfterViewInit {
    public readonly ascendingSortIcon: IconDefinition = faArrowUpLong;
    public readonly descendingSortIcon: IconDefinition = faArrowDownLong;

    @ViewChild("gridHeaderElement")
    public set gridHeaderElement(value: ElementRef<HTMLDivElement>) {
        this.gridService.gridHeaderElement = value.nativeElement;
        window.setTimeout(() => this.setInitialCalculatedWidthOfColumns());
    }

    @Input()
    public set pageSize(value: number) {
        this.gridService.pageState.take = value;
    }

    @Input()
    public pageSizeValues: number[] = [];

    @Input()
    public resizable: boolean = true;

    public constructor(public readonly gridService: GridService, private readonly cdr: ChangeDetectorRef) {}

    public ngAfterViewInit(): void {
        this.cdr.detectChanges();
    }

    public ngOnInit(): void {}

    public onColumnFilter(column: Column, state: ColumnFilterState): void {
        if (state.filter && state.filter.filters.length > 0) {
            this.gridService.appliedFilters.put(column.field, state);
            column.filtered = true;
        } else {
            this.gridService.appliedFilters.remove(column.field);
            column.filtered = false;
        }
        this.gridService.appliedFilters = this.gridService.appliedFilters.toDictionary(
            p => p.key,
            p => p.value
        );
    }

    public onColumnSort(column: Column): void {
        if (column.sortDirection == null) {
            column.sortDirection = "asc";
        } else if (column.sortDirection === "asc") {
            column.sortDirection = "desc";
        } else {
            column.sortDirection = undefined;
            column.sortIndex = undefined;
        }
        if (column.sortDirection != null) {
            const sortDescriptor: SortDescriptor = {
                field: column.field,
                dir: column.sortDirection
            };
            this.gridService.appliedSorts.put(column.field, { sort: sortDescriptor });
        } else {
            this.gridService.appliedSorts.remove(column.field);
        }
        this.gridService.appliedSorts.keys().forEach((field, fx) => {
            const col = this.gridService.columns.find(c => c.field === field);
            if (col) {
                col.sortIndex = fx + 1;
            }
        });
        this.gridService.appliedSorts = this.gridService.appliedSorts.toDictionary(
            p => p.key,
            p => p.value
        );
    }

    public onPageChange(event: PageChangeEvent): void {
        this.gridService.pageState = {
            skip: event.skip,
            take: event.take
        };
        this.cdr.detectChanges();
    }

    public onPageSizeChange(data: PageSizeChangeEvent): void {
        this.gridService.pageState = {
            skip: 0,
            take: data.newPageSize
        };
        this.cdr.detectChanges();
    }

    private setInitialCalculatedWidthOfColumns(): void {
        if (this.gridService.gridHeaderElement) {
            const thList = this.gridService.gridHeaderElement?.querySelectorAll("th");
            for (const [cx, column] of Array.from(thList).entries()) {
                this.gridService.columns[cx].calculatedWidth = column.offsetWidth;
            }
        }
    }

    public get headerMargin(): string {
        const rightMargin = 12;
        return `0 ${rightMargin}px 0 0`;
    }
}
