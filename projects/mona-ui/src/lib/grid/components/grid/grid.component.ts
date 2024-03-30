import { CdkDrag, CdkDragDrop, CdkDragEnter, CdkDragPreview, CdkDragStart, CdkDropList } from "@angular/cdk/drag-drop";
import { NgStyle, NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    contentChildren,
    DestroyRef,
    effect,
    ElementRef,
    inject,
    input,
    InputSignal,
    model,
    OnInit,
    output,
    OutputEmitterRef,
    untracked,
    viewChild
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
        PagerComponent
    ],
    host: {
        class: "mona-grid"
    }
})
export class GridComponent implements OnInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    protected readonly ascendingSortIcon: IconDefinition = faArrowUpLong;
    protected readonly columns = contentChildren(GridColumnComponent);
    protected readonly descendingSortIcon: IconDefinition = faArrowDownLong;
    protected readonly gridHeaderElement = viewChild.required<ElementRef<HTMLDivElement>>("gridHeaderElement");
    protected readonly gridService: GridService = inject(GridService);
    protected readonly groupColumnList = viewChild<CdkDropList>("groupColumnList");
    protected readonly headerMargin =
        navigator.userAgent.toLowerCase().indexOf("firefox") > -1 ? "0 16px 0 0" : "0 12px 0 0";
    protected columnDragging: boolean = false;
    protected dragColumn?: Column;
    protected dropColumn?: Column;
    protected gridColumns: Column[] = [];
    protected groupPanelPlaceholderVisible: boolean = true;
    protected resizing: boolean = false;

    public readonly cellEdit: OutputEmitterRef<CellEditEvent> = output();

    public data = input<any[]>([]);
    public filter = model<CompositeFilterDescriptor[]>([]);
    public filterable: InputSignal<boolean> = input(false);
    public groupable: InputSignal<boolean> = input(false);
    public pageSize = input<number | undefined>(undefined);
    public pageSizeValues: InputSignal<number[]> = input<number[]>([]);
    public reorderable: InputSignal<boolean> = input(false);
    public resizable: InputSignal<boolean> = input(false);
    public responsivePager: InputSignal<boolean> = input(true);
    public sort = model<SortDescriptor[]>([]);
    public sortable = input<boolean | SortableOptions>(false);

    public constructor() {
        this.setFilterEffect();
        this.setSortableOptionsEffect();
        this.setSortEffect();
        this.setPageSizeEffect();
        this.setColumnEffect();
        this.setGridHeaderElementEffect();
        this.setDataEffect();
    }

    public ngOnInit(): void {
        this.setSubscriptions();
    }

    public onColumnDragEnter(event: CdkDragEnter<void, Column>, column: Column): void {
        this.groupPanelPlaceholderVisible = event.container !== this.groupColumnList();
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
        const dropColumnIndex = this.gridService
            .columns()
            .indexOf(this.dropColumn, c => c.field() === this.dropColumn?.field());
        this.gridService.columns.update(columns => {
            const list = columns.toList();
            list.remove(this.dragColumn as Column);
            list.addAt(this.dragColumn as Column, dropColumnIndex);
            list.forEach((c, i) => c.index.set(i));
            return list.toImmutableList();
        });
        this.columnDragging = false;
        this.dragColumn = undefined;
        this.dropColumn = undefined;
    }

    public onColumnDropForGrouping(event: CdkDragDrop<Column, void, Column>): void {
        if (!this.groupable()) {
            return;
        }
        const column = event.item.data;
        this.gridService.groupColumns.update(columns => [...columns, column]);
        if (!this.gridService.appliedSorts().containsKey(column.field())) {
            this.onColumnSort(column);
        }
        this.columnDragging = false;
        this.dragColumn = undefined;
        this.dropColumn = undefined;
    }

    public onColumnFilter(column: Column, state: ColumnFilterState): void {
        if (state.filter && state.filter.filters.length > 0) {
            this.gridService.appliedFilters.update(dict => dict.put(column.field(), state));
            column.filtered.set(true);
        } else {
            this.gridService.appliedFilters.update(dict => dict.remove(column.field()));
            column.filtered.set(false);
        }
        const allFilters = this.gridService
            .appliedFilters()
            .values()
            .select(p => p.filter)
            .where(f => f != null);
        if (allFilters.any()) {
            this.filter.set(allFilters.toArray() as CompositeFilterDescriptor[]);
        } else if (this.filter().length !== 0) {
            this.filter.set([]);
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
        if (!column.field()) {
            return;
        }
        if (column.sortDirection() == null) {
            column.sortDirection.set("asc");
        } else if (column.sortDirection() === "asc") {
            column.sortDirection.set("desc");
        } else if (
            this.gridService
                .groupColumns()
                .map(c => c.field())
                .includes(column.field())
        ) {
            column.sortDirection.set("asc");
        } else if (this.gridService.sortableOptions.allowUnsort) {
            column.sortDirection.set(null);
            column.sortIndex.set(null);
        } else {
            column.sortDirection.set("asc");
        }
        this.applyColumnSort(column, column.sortDirection());
        const sortDescriptors = this.gridService
            .appliedSorts()
            .values()
            .select(s => s.sort)
            .toArray();
        this.sort.set(sortDescriptors);
    }

    public onGroupingColumnRemove(event: Event, column: Column): void {
        event.stopPropagation();
        this.gridService.groupColumns.update(columns => columns.filter(c => c.field() !== column.field()));
        this.gridService.gridGroupExpandState = this.gridService.gridGroupExpandState
            .where(p => !p.key.startsWith(column.field()))
            .toDictionary(
                p => p.key,
                p => p.value
            );
        this.applyColumnSort(column, null);
        this.groupPanelPlaceholderVisible = this.gridService.groupColumns.length === 0;
    }

    public onPageChange(event: PageChangeEvent): void {
        this.gridService.pageState.page.set(event.page);
        this.gridService.pageState.skip.set(event.skip);
        this.gridService.pageState.take.set(event.take);

        const scrollableElement = this.#hostElementRef.nativeElement.querySelector("div.mona-grid-list") as HTMLElement;
        if (scrollableElement) {
            scrollableElement.scrollTop = 0;
        }
    }

    public onPageSizeChange(data: PageSizeChangeEvent): void {
        this.gridService.pageState.page.set(1);
        this.gridService.pageState.skip.set(0);
        this.gridService.pageState.take.set(data.newPageSize);
    }

    private applyColumnSort(column: Column, sortDirection: "asc" | "desc" | null): void {
        column.sortDirection.set(sortDirection);
        if (this.gridService.sortableOptions.mode === "single") {
            Enumerable.from(this.gridService.columns())
                .where(c => c.field() !== column.field())
                .forEach(c => {
                    c.sortDirection.set(null);
                    c.sortIndex.set(null);
                    this.gridService.appliedSorts.update(dict => dict.remove(c.field()));
                });
        }
        if (column.sortDirection() != null) {
            const sortDescriptor: SortDescriptor = {
                field: column.field(),
                dir: column.sortDirection() as "asc" | "desc"
            };
            this.gridService.appliedSorts.update(dict => dict.put(column.field(), { sort: sortDescriptor }));
        } else {
            this.gridService.appliedSorts.update(dict => dict.remove(column.field()));
            column.sortIndex.set(null);
        }
        this.gridService
            .appliedSorts()
            .keys()
            .forEach((field, fx) => {
                const col = this.gridService.columns().firstOrDefault(c => c.field() === field);
                if (col) {
                    col.sortIndex.set(fx + 1);
                }
            });
    }

    private setColumnEffect(): void {
        effect(() => {
            const columns = this.columns();
            untracked(() => {
                this.gridColumns = columns.map(c => c.column);
                this.gridService.columns.update(list => list.clear().addAll(this.gridColumns));
                this.gridService.columns().forEach((c, i) => c.index.set(i));
                if (this.filter().length !== 0) {
                    this.gridService.loadFilters(this.filter());
                }
                if (this.sort().length !== 0) {
                    this.gridService.loadSorts(this.sort());
                }
            });
        });
    }

    private setDataEffect(): void {
        effect(() => {
            const data = this.data();
            untracked(() => this.gridService.setRows(data));
        });
    }

    private setFilterEffect(): void {
        effect(() => {
            const filter = this.filter();
            untracked(() => this.gridService.loadFilters(filter));
        });
    }

    private setGridHeaderElementEffect(): void {
        effect(() => {
            const headerElement = this.gridHeaderElement();
            untracked(() => {
                this.gridService.gridHeaderElement = headerElement.nativeElement;
                this.setInitialCalculatedWidthOfColumns();
            });
        });
    }

    private setInitialCalculatedWidthOfColumns(): void {
        if (this.gridService.gridHeaderElement) {
            window.setTimeout(() => {
                const headerElement = this.gridService.gridHeaderElement as HTMLElement;
                const thList = headerElement.querySelectorAll("th");
                const thArray = Array.from(thList);
                for (const [cx, columnTh] of thArray.entries()) {
                    const gridCol = this.gridService.columns().elementAt(cx);
                    gridCol.calculatedWidth.set(gridCol.width() ?? Math.floor(columnTh.getBoundingClientRect().width));
                }
            });
        }
    }

    private setPageSizeEffect(): void {
        effect(() => {
            const pageSize = this.pageSize();
            if (pageSize != null) {
                untracked(() => this.gridService.pageState.take.set(pageSize));
            }
        });
    }

    private setSortEffect(): void {
        effect(() => {
            const sort = this.sort();
            untracked(() => this.gridService.loadSorts(sort));
        });
    }

    private setSortableOptionsEffect(): void {
        effect(() => {
            const sortable = this.sortable();
            untracked(() => {
                if (typeof sortable === "boolean") {
                    this.gridService.setSortableOptions({ enabled: sortable });
                } else {
                    this.gridService.setSortableOptions(sortable);
                }
            });
        });
    }

    private setSubscriptions(): void {
        this.gridService.cellEdit$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((event: CellEditEvent) => this.cellEdit.emit(event));
    }
}
