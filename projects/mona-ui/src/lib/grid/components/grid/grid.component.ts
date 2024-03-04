import { CdkDrag, CdkDragDrop, CdkDragEnter, CdkDragPreview, CdkDragStart, CdkDropList } from "@angular/cdk/drag-drop";
import { NgStyle, NgTemplateOutlet } from "@angular/common";
import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    DestroyRef,
    ElementRef,
    EventEmitter,
    inject,
    input,
    Input,
    InputSignal,
    OnInit,
    Output,
    QueryList,
    ViewChild
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faArrowDownLong, faArrowUpLong, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Enumerable } from "@mirei/ts-collections";
import { ChipComponent } from "../../../buttons/chip/chip.component";
import { PagerComponent } from "../../../pager/components/pager/pager.component";
import { PageChangeEvent } from "../../../pager/models/PageChangeEvent";
import { PageSizeChangeEvent } from "../../../pager/models/PageSizeChangeEvent";
import { CompositeFilterDescriptor } from "../../../query/filter/FilterDescriptor";
import { SortDescriptor } from "../../../query/sort/SortDescriptor";
import { GridColumnResizeHandlerDirective } from "../../directives/grid-column-resize-handler.directive";
import { CellEditEvent } from "../../models/CellEditEvent";
import { Column } from "../../models/Column";
import { ColumnFilterState } from "../../models/ColumnFilterState";
import { SortableOptions } from "../../models/SortableOptions";
import { GridFilterPipe } from "../../pipes/grid-filter.pipe";
import { GridPagePipe } from "../../pipes/grid-page.pipe";
import { GridService } from "../../services/grid.service";
import { GridColumnComponent } from "../grid-column/grid-column.component";
import { GridFilterMenuComponent } from "../grid-filter-menu/grid-filter-menu.component";
import { GridListComponent } from "../grid-list/grid-list.component";

@Component({
    selector: "mona-grid",
    templateUrl: "./grid.component.html",
    styleUrls: ["./grid.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [GridService],
    standalone: true,
    imports: [
        CdkDropList,
        ChipComponent,
        NgStyle,
        CdkDrag,
        NgTemplateOutlet,
        FontAwesomeModule,
        GridFilterMenuComponent,
        GridColumnResizeHandlerDirective,
        CdkDragPreview,
        GridListComponent,
        PagerComponent,
        GridFilterPipe,
        GridPagePipe
    ],
    host: {
        class: "mona-grid"
    }
})
export class GridComponent implements OnInit, AfterViewInit, AfterContentInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    #filter: CompositeFilterDescriptor[] = [];
    #sort: SortDescriptor[] = [];
    protected readonly ascendingSortIcon: IconDefinition = faArrowUpLong;
    protected readonly descendingSortIcon: IconDefinition = faArrowDownLong;
    protected readonly headerMargin =
        navigator.userAgent.toLowerCase().indexOf("firefox") > -1 ? "0 16px 0 0" : "0 12px 0 0";
    protected columnDragging: boolean = false;
    protected dragColumn?: Column;
    protected dropColumn?: Column;
    protected gridColumns: Column[] = [];
    protected groupPanelPlaceholderVisible: boolean = true;
    protected resizing: boolean = false;

    public filterable: InputSignal<boolean> = input(false);
    public groupable: InputSignal<boolean> = input(false);
    public pageSizeValues: InputSignal<number[]> = input<number[]>([]);
    public reorderable: InputSignal<boolean> = input(false);
    public resizable: InputSignal<boolean> = input(false);
    public responsivePager: InputSignal<boolean> = input(true);

    @Output()
    public cellEdit: EventEmitter<CellEditEvent> = new EventEmitter<CellEditEvent>();

    @ContentChildren(GridColumnComponent)
    public columns: QueryList<GridColumnComponent> = new QueryList<GridColumnComponent>();

    @Input()
    public set data(value: any[]) {
        this.gridService.setRows(value);
    }

    @Input()
    public set filter(value: CompositeFilterDescriptor[]) {
        if (this.#filter !== value) {
            this.#filter = value;
            this.gridService.loadFilters(value);
        }
    }

    public get filter(): CompositeFilterDescriptor[] {
        return this.#filter;
    }

    @Output()
    public filterChange: EventEmitter<CompositeFilterDescriptor[]> = new EventEmitter<CompositeFilterDescriptor[]>();

    @ViewChild("gridHeaderElement")
    public set gridHeaderElement(value: ElementRef<HTMLDivElement>) {
        this.gridService.gridHeaderElement = value.nativeElement;
    }

    @ViewChild("groupColumnList")
    public groupColumnList?: CdkDropList;

    @Input()
    public set pageSize(value: number) {
        this.gridService.pageState.take = value;
    }

    @Input()
    public set sort(value: SortDescriptor[]) {
        if (this.#sort !== value) {
            this.#sort = value;
            this.gridService.loadSorts(value);
        }
    }

    public get sort(): SortDescriptor[] {
        return this.#sort;
    }

    @Output()
    public sortChange: EventEmitter<SortDescriptor[]> = new EventEmitter<SortDescriptor[]>();

    @Input()
    public set sortable(options: boolean | SortableOptions) {
        if (typeof options === "boolean") {
            this.gridService.setSortableOptions({ enabled: true });
        } else {
            this.gridService.setSortableOptions(options);
        }
    }

    public constructor(
        public readonly gridService: GridService,
        private readonly cdr: ChangeDetectorRef
    ) {}

    public ngAfterContentInit(): void {
        const processColumns = () => {
            this.gridColumns = this.columns.map(c => c.column);
            this.gridService.columns = this.gridColumns;
            this.gridService.columns.forEach((c, i) => (c.index = i));
            if (this.filter.length !== 0) {
                this.gridService.loadFilters(this.filter);
            }
            if (this.sort.length !== 0) {
                this.gridService.loadSorts(this.sort);
            }
        };
        processColumns();
        this.columns.changes.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
            processColumns();
        });
    }

    public ngAfterViewInit(): void {
        this.setInitialCalculatedWidthOfColumns();
        this.cdr.detectChanges();
    }

    public ngOnInit(): void {
        this.setSubscriptions();
    }

    public onColumnDragEnter(event: CdkDragEnter<void, Column>, column: Column): void {
        this.groupPanelPlaceholderVisible = event.container !== this.groupColumnList;
    }

    public onColumnDragStart(event: CdkDragStart<Column>): void {
        if (this.resizing) {
            return;
        }
        this.columnDragging = true;
        this.dragColumn = event.source.data;
    }

    public onColumnDrop(event: CdkDragDrop<Column>): void {
        if (!this.dropColumn || !this.dragColumn || !this.columnDragging || this.resizing || !this.reorderable()) {
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

    public onColumnDropForGrouping(event: CdkDragDrop<Column, void, Column>): void {
        if (!this.groupable()) {
            return;
        }
        const column = event.item.data;
        this.gridService.groupColumns = [...this.gridService.groupColumns, column];
        if (!this.gridService.appliedSorts.containsKey(column.field)) {
            this.onColumnSort(column);
        }
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
        const allFilters = this.gridService.appliedFilters
            .values()
            .select(p => p.filter)
            .where(f => f != null);
        if (allFilters.any()) {
            this.#filter = allFilters.toArray() as CompositeFilterDescriptor[];
            this.filterChange.emit(this.#filter);
        } else if (this.#filter.length !== 0) {
            this.#filter = [];
            this.filterChange.emit(this.#filter);
        }
    }

    public onColumnMouseEnter(event: MouseEvent, column: Column): void {
        if (!this.columnDragging || this.resizing) {
            return;
        }
        this.dropColumn = column;
    }

    public onColumnResizeStart(): void {
        this.resizing = true;
    }

    public onColumnSort(column: Column): void {
        if (!this.gridService.sortableOptions.enabled) {
            return;
        }
        if (!column.field) {
            return;
        }
        if (column.sortDirection == null) {
            column.sortDirection = "asc";
        } else if (column.sortDirection === "asc") {
            column.sortDirection = "desc";
        } else if (this.gridService.groupColumns.map(c => c.field).includes(column.field)) {
            column.sortDirection = "asc";
        } else if (this.gridService.sortableOptions.allowUnsort) {
            column.sortDirection = undefined;
            column.sortIndex = undefined;
        } else {
            column.sortDirection = "asc";
        }
        this.applyColumnSort(column, column.sortDirection);
        this.#sort = this.gridService.appliedSorts
            .values()
            .select(s => s.sort)
            .toArray();
        this.sortChange.emit(this.#sort);
    }

    public onGroupingColumnRemove(event: Event, column: Column): void {
        event.stopPropagation();
        this.gridService.groupColumns = this.gridService.groupColumns.filter(c => c.field !== column.field);
        this.gridService.gridGroupExpandState = this.gridService.gridGroupExpandState
            .where(p => !p.key.startsWith(column.field))
            .toDictionary(
                p => p.key,
                p => p.value
            );
        this.applyColumnSort(column, undefined);
        this.groupPanelPlaceholderVisible = this.gridService.groupColumns.length === 0;
    }

    public onPageChange(event: PageChangeEvent): void {
        this.gridService.pageState = {
            page: event.page,
            skip: event.skip,
            take: event.take
        };
        const scrollableElement = this.#hostElementRef.nativeElement.querySelector("div.mona-grid-list") as HTMLElement;
        if (scrollableElement) {
            scrollableElement.scrollTop = 0;
        }
        this.cdr.detectChanges();
    }

    public onPageSizeChange(data: PageSizeChangeEvent): void {
        this.gridService.pageState = {
            page: 1,
            skip: 0,
            take: data.newPageSize
        };
        this.cdr.detectChanges();
    }

    private applyColumnSort(column: Column, sortDirection: "asc" | "desc" | undefined): void {
        column.sortDirection = sortDirection;
        if (this.gridService.sortableOptions.mode === "single") {
            Enumerable.from(this.gridService.columns)
                .where(c => c.field !== column.field)
                .forEach(c => {
                    c.sortDirection = undefined;
                    c.sortIndex = undefined;
                    this.gridService.appliedSorts.remove(c.field);
                });
        }
        if (column.sortDirection != null) {
            const sortDescriptor: SortDescriptor = {
                field: column.field,
                dir: column.sortDirection
            };
            this.gridService.appliedSorts.put(column.field, { sort: sortDescriptor });
        } else {
            this.gridService.appliedSorts.remove(column.field);
            column.sortIndex = undefined;
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

    private setInitialCalculatedWidthOfColumns(): void {
        if (this.gridService.gridHeaderElement) {
            const thList = this.gridService.gridHeaderElement?.querySelectorAll("th");
            for (const [cx, columnTh] of Array.from(thList).entries()) {
                const gridCol = this.gridService.columns[cx];
                gridCol.calculatedWidth.set(gridCol.width ?? columnTh.getBoundingClientRect().width);
            }
        }
    }

    private setSubscriptions(): void {
        this.gridService.cellEdit$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((event: CellEditEvent) => this.cellEdit.emit(event));
    }
}
