import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    ElementRef,
    Input,
    OnInit,
    QueryList,
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
import { GridColumnComponent } from "../grid-column/grid-column.component";
import { CdkDragDrop, CdkDragEnd, CdkDragMove, CdkDragStart } from "@angular/cdk/drag-drop";
import { Node } from "../../../tree-view/data/Node";
import { NodeDragEndEvent } from "../../../tree-view/data/NodeDragEndEvent";
import { NodeDragEvent } from "../../../tree-view/data/NodeDragEvent";
import { NodeDragStartEvent } from "../../../tree-view/data/NodeDragStartEvent";

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
    public columnDragging: boolean = false;
    public dragColumn?: Column;
    public dropColumn?: Column;
    public gridColumns: Column[] = [];
    public resizing: boolean = false;

    @ContentChildren(GridColumnComponent)
    public set columns(value: QueryList<GridColumnComponent>) {
        this.gridColumns = value.map(c => c.column);
        this.gridService.columns = this.gridColumns;
        this.gridService.columns.forEach((c, i) => (c.index = i));
    }

    @Input()
    public set data(value: any[]) {
        this.gridService.setRows(value);
    }

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
    public reorderable: boolean = false;

    @Input()
    public resizable: boolean = true;

    public constructor(
        public readonly gridService: GridService,
        private readonly cdr: ChangeDetectorRef,
        private readonly elementRef: ElementRef<HTMLElement>
    ) {}

    public ngAfterViewInit(): void {
        this.cdr.detectChanges();
    }

    public ngOnInit(): void {}

    public onColumnDragStart(event: CdkDragStart<Column>): void {
        if (this.resizing) {
            return;
        }
        this.columnDragging = true;
        this.dragColumn = event.source.data;
    }

    public onColumnDrop(event: CdkDragDrop<Column>): void {
        if (!this.dropColumn || !this.dragColumn || !this.columnDragging || this.resizing) {
            return;
        }
        const dropColumnIndex = this.gridService.columns.findIndex(c => c.field === this.dropColumn?.field);
        const dragColumnIndex = this.gridService.columns.findIndex(c => c.field === this.dragColumn?.field);
        this.gridService.columns.splice(dropColumnIndex, 0, this.gridService.columns.splice(dragColumnIndex, 1)[0]);
        this.gridService.columns.forEach((c, i) => (c.index = i));
        this.gridService.columns = [...this.gridService.columns];
        this.columnDragging = false;
        this.dragColumn = undefined;
        this.dropColumn = undefined;
    }

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

    public onColumnMouseEnter(event: MouseEvent, column: Column): void {
        if (!this.columnDragging || this.resizing) {
            return;
        }
        this.dropColumn = column;
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
        const scrollableElement = this.elementRef.nativeElement.querySelector("div.mona-grid-list") as HTMLElement;
        if (scrollableElement) {
            scrollableElement.scrollTop = 0;
        }
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
