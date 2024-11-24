import {
    CdkDrag,
    CdkDragDrop,
    CdkDragEnter,
    CdkDragExit,
    CdkDragPlaceholder,
    CdkDragPreview,
    CdkDragStart,
    CdkDropList
} from "@angular/cdk/drag-drop";
import { NgStyle, NgTemplateOutlet } from "@angular/common";
import {
    afterNextRender,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    contentChild,
    contentChildren,
    DestroyRef,
    effect,
    ElementRef,
    inject,
    input,
    model,
    OnInit,
    output,
    signal,
    TemplateRef,
    untracked,
    viewChild
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Collections } from "@mirei/ts-collections";
import { v4 } from "uuid";
import { ChipComponent } from "../../../buttons/chip/chip.component";
import { PlaceholderComponent } from "../../../layout/placeholder/placeholder.component";
import { ContextMenuComponent } from "../../../menus/context-menu/context-menu.component";
import { MenuItemIconTemplateDirective } from "../../../menus/directives/menu-item-icon-template.directive";
import { MenuItemComponent } from "../../../menus/menu-item/menu-item.component";
import { PagerComponent } from "../../../pager/components/pager/pager.component";
import { PageChangeEvent } from "../../../pager/models/PageChangeEvent";
import { PageSizeChangeEvent } from "../../../pager/models/PageSizeChangeEvent";
import { CompositeFilterDescriptor } from "../../../query/filter/FilterDescriptor";
import { SortDescriptor, SortDirection } from "../../../query/sort/SortDescriptor";
import { GridColumnResizeHandlerDirective } from "../../directives/grid-column-resize-handler.directive";
import { GridDetailTemplateDirective } from "../../directives/grid-detail-template.directive";
import { GridNoDataTemplateDirective } from "../../directives/grid-no-data-template.directive";
import { CellEditEvent } from "../../models/CellEditEvent";
import { Column } from "../../models/Column";
import { ColumnFilterState } from "../../models/ColumnFilterState";
import { ResizeMethod } from "../../models/ResizeMethod";
import { SortableOptions } from "../../models/SortableOptions";
import { GridService } from "../../services/grid.service";
import { GridColumnComponent } from "../grid-column/grid-column.component";
import { GridFilterMenuComponent } from "../grid-filter-menu/grid-filter-menu.component";
import { GridListComponent } from "../grid-list/grid-list.component";
import { GridVirtualListComponent } from "../grid-virtual-list/grid-virtual-list.component";

@Component({
    selector: "mona-grid",
    templateUrl: "./grid.component.html",
    styleUrls: ["./grid.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [GridService],
    imports: [
        CdkDropList,
        ChipComponent,
        NgStyle,
        CdkDrag,
        NgTemplateOutlet,
        GridFilterMenuComponent,
        GridColumnResizeHandlerDirective,
        CdkDragPreview,
        GridListComponent,
        PagerComponent,
        GridVirtualListComponent,
        CdkDragPlaceholder,
        ContextMenuComponent,
        MenuItemComponent,
        MenuItemIconTemplateDirective,
        PlaceholderComponent
    ],
    host: {
        class: "mona-grid",
        "[attr.data-uid]": "uid"
    }
})
export class GridComponent<T> implements OnInit {
    readonly #cdr = inject(ChangeDetectorRef);
    readonly #destroyRef = inject(DestroyRef);
    readonly #hostElementRef = inject(ElementRef<HTMLElement>);
    protected readonly columns = contentChildren(GridColumnComponent);
    protected readonly gridDetailTemplate = contentChild(GridDetailTemplateDirective, { read: TemplateRef });
    protected readonly gridHeaderElement = viewChild.required<ElementRef<HTMLDivElement>>("gridHeaderElement");
    protected readonly gridService = inject(GridService);
    protected readonly gridWidthSet = signal(false);
    protected readonly groupColumnList = viewChild<CdkDropList>("groupColumnList");
    protected readonly groupPanelPlaceholderVisible = signal(true);
    protected readonly groupable = computed(() => this.gridService.groupableOptions().enabled);
    protected readonly groupingInProgress = signal(false);
    protected readonly headerMargin = "0 15px 0 0";
    protected readonly noDataTemplate = contentChild(GridNoDataTemplateDirective, { read: TemplateRef });
    protected readonly resizing = signal(false);
    protected readonly uid = v4();
    protected columnDragging = false;
    protected dragColumn?: Column;
    protected dropColumn?: Column;
    protected gridColumns: Column[] = [];

    /**
     * Emitted when a cell is edited.
     */
    public readonly cellEdit = output<CellEditEvent>();

    /**
     * The row data to be displayed in the grid.
     */
    public data = input<Iterable<T>>([]);

    /**
     * Initial filter configuration to be applied to the grid when it is loaded.
     */
    public filter = model<CompositeFilterDescriptor[]>([]);

    /**
     * Whether the grid is filterable.
     */
    public filterable = input(false);

    /**
     * The number of items to be displayed on a page.
     */
    public pageSize = input<number | undefined>(undefined);

    /**
     * The page sizes that the user can select from.
     * These values will be displayed in the page size dropdown.
     */
    public pageSizeValues = input<number[]>([]);

    /**
     * Whether the columns of the grid can be reordered.
     */
    public reorderable = input(false);

    /**
     * Whether the columns of the grid can be resized.
     */
    public resizable = input(false);

    /**
     * The method to be used to set initial column widths.
     * It can be the following values:
     * - `fitView`: The columns will be resized to fit the available width.
     * - `auto`: The columns will be resized based on the content.
     * - A number representing the width of the columns. All columns except the columns with a specified width
     *   will have the same width.
     * @default "fitView"
     */
    public resizeMethod = input<ResizeMethod>("fitView");

    /**
     * Whether the pager is responsive.
     * If set to `true`, the pager will be displayed as a dropdown when the grid width gets smaller.
     */
    public responsivePager = input(true);

    /**
     * Initial sort configuration to be applied to the grid when it is loaded.
     */
    public sort = model<SortDescriptor[]>([]);

    /**
     * Whether the grid is sortable.
     */
    public sortable = input<boolean | SortableOptions>(false);

    public constructor() {
        this.setFilterEffect();
        this.setSortableOptionsEffect();
        this.setSortEffect();
        this.setPageSizeEffect();
        this.setColumnEffect();
        this.setGridHeaderElementEffect();
        this.setGridDetailEffect();
        this.setDataEffect();
    }

    public ngOnInit(): void {
        this.setSubscriptions();
    }

    public onColumnDragEnter(event: CdkDragEnter<void, Column>, column: Column): void {
        this.groupPanelPlaceholderVisible.set(event.container !== this.groupColumnList());
    }

    public onColumnDragEnterForGrouping(event: CdkDragEnter<void, Column>): void {
        this.groupingInProgress.set(true);
    }

    public onColumnDragExitForGrouping(event: CdkDragExit<void, Column>): void {
        this.groupingInProgress.set(false);
    }

    public onColumnDragStart(event: CdkDragStart<Column>): void {
        if (this.resizing()) {
            return;
        }
        this.columnDragging = true;
        this.dragColumn = event.source.data;
    }

    public onColumnDrop(event: CdkDragDrop<Column>): void {
        if (!this.dropColumn || !this.dragColumn || !this.columnDragging || this.resizing() || !this.reorderable()) {
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
        if (this.gridService.groupColumns().contains(column)) {
            return;
        }

        column.groupSortDirection.set("asc");
        this.gridService.groupColumns.update(columns => columns.add(column));
        this.gridService.appliedGroupSorts.update(dict =>
            dict.put(column.field(), { sort: { field: column.field(), dir: "asc" } })
        );

        this.columnDragging = false;
        this.dragColumn = undefined;
        this.dropColumn = undefined;
        this.groupingInProgress.set(false);
        this.#cdr.detectChanges();
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
        if (!this.columnDragging || this.resizing()) {
            return;
        }
        this.dropColumn = column;
    }

    public onColumnResizeStart(): void {
        this.resizing.set(true);
    }

    public onColumnSort(column: Column): void {
        if (!this.gridService.sortableOptions.enabled) {
            return;
        }
        if (!column.field()) {
            return;
        }
        if (column.columnSortDirection() == null) {
            column.columnSortDirection.set("asc");
        } else if (column.columnSortDirection() === "asc") {
            column.columnSortDirection.set("desc");
        } else if (this.gridService.sortableOptions.allowUnsort) {
            column.columnSortDirection.set(null);
            column.sortIndex.set(null);
        } else {
            column.columnSortDirection.set("asc");
        }
        this.applyColumnSort(column, column.columnSortDirection());
        const sortDescriptors = this.gridService
            .appliedSorts()
            .values()
            .select(s => s.sort)
            .toArray();
        this.sort.set(sortDescriptors);
    }

    public onGroupingColumnRemove(event: Event, column: Column): void {
        event.stopPropagation();
        column.groupSortDirection.set(null);
        this.gridService.appliedGroupSorts.update(dict => dict.remove(column.field()));
        this.gridService.groupColumns.update(columns =>
            columns.where(c => c.field() !== column.field()).toImmutableSet()
        );
        this.gridService.gridGroupExpandState = this.gridService.gridGroupExpandState
            .where(p => !p.key.startsWith(column.field()))
            .toDictionary(
                p => p.key,
                p => p.value
            );
        this.groupPanelPlaceholderVisible.set(this.gridService.groupColumns().length === 0);
    }

    public onGroupColumnReorder(column: Column, moveAs: "prev" | "next"): void {
        this.gridService.groupColumns.update(cols => {
            const colList = cols.toList();
            const index = colList.indexOf(column);
            const newIndex = moveAs === "prev" ? index - 1 : index + 1;
            if (newIndex < 0 || newIndex >= colList.size()) {
                return colList.toImmutableSet();
            }
            Collections.swap(colList, index, newIndex);
            return colList.toImmutableSet();
        });
    }

    public onGroupingColumnSort(column: Column): void {
        if (column.groupSortDirection() == null) {
            column.groupSortDirection.set("asc");
        } else if (column.groupSortDirection() === "asc") {
            column.groupSortDirection.set("desc");
        } else if (column.groupSortDirection() === "desc") {
            column.groupSortDirection.set("asc");
        }
        this.gridService.appliedGroupSorts.update(dict =>
            dict
                .remove(column.field())
                .add(column.field(), { sort: { field: column.field(), dir: column.groupSortDirection() ?? "asc" } })
        );
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

    private applyColumnSort(column: Column, sortDirection: SortDirection | null): void {
        column.columnSortDirection.set(sortDirection);
        if (this.gridService.sortableOptions.mode === "single") {
            this.gridService
                .columns()
                .where(c => c.field() !== column.field())
                .forEach(c => {
                    c.columnSortDirection.set(null);
                    c.sortIndex.set(null);
                    this.gridService.appliedSorts.update(dict => dict.remove(c.field()));
                });
        }
        if (column.columnSortDirection() != null) {
            const sortDescriptor: SortDescriptor = {
                field: column.field(),
                dir: column.columnSortDirection() as SortDirection
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

    private getTableColumnHeaderCellList(): HTMLTableCellElement[] {
        const headerElement = this.gridHeaderElement();
        if (!headerElement) {
            return [];
        }
        const thList = headerElement.nativeElement.querySelectorAll("th");
        const headerCells = Array.from(thList) as HTMLTableCellElement[];
        if (this.gridService.masterDetailTemplate()) {
            headerCells.shift();
        }
        for (const _ of this.gridService.groupColumns()) {
            headerCells.shift();
        }
        return headerCells;
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

    private setGridDetailEffect(): void {
        effect(() => {
            const detailTemplate = this.gridDetailTemplate() ?? null;
            untracked(() => this.gridService.masterDetailTemplate.set(detailTemplate));
        });
    }

    private setGridHeaderElementEffect(): void {
        afterNextRender(() => {
            const headerElement = this.gridHeaderElement();
            untracked(() => {
                window.setTimeout(() => {
                    this.gridService.gridHeaderElement.set(headerElement.nativeElement);
                });
            });
        });
        effect(() => {
            const headerElement = this.gridHeaderElement();
            if (headerElement) {
                untracked(() => {
                    window.setTimeout(() => {
                        this.setInitialCalculatedWidthOfColumns();
                        this.gridWidthSet.set(true);
                    });
                });
            }
        });
    }

    private setInitialCalculatedWidthOfColumns(): void {
        if (this.gridService.gridHeaderElement()) {
            const headerElement = this.gridService.gridHeaderElement() as HTMLElement;
            const headerCells = this.getTableColumnHeaderCellList();
            let headerWidth = headerElement.clientWidth;
            const columnsWithWidth = this.gridService.columns().where(c => c.width() != null);
            if (columnsWithWidth.any()) {
                headerWidth -= columnsWithWidth.sum(c => c.width() ?? 0);
            }
            if (this.gridService.masterDetailTemplate()) {
                headerWidth -= this.gridService.detailColumnWidth;
            }
            headerWidth -= this.gridService.groupColumnWidth * this.gridService.groupColumns().size();

            for (const [cx, columnTh] of headerCells.entries()) {
                const gridCol = this.gridService.columns().elementAt(cx);
                let calculatedWidth: number;
                if (typeof this.resizeMethod() === "number") {
                    calculatedWidth = this.resizeMethod() as number;
                } else if (this.resizeMethod() === "fitView") {
                    calculatedWidth = (headerWidth + 1) / headerCells.length;
                } else {
                    calculatedWidth = this.gridService.findTextWidthOfColumn(gridCol, columnTh);
                }
                if (gridCol.width() != null) {
                    gridCol.calculatedWidth.set(gridCol.width());
                } else {
                    const minWidth = gridCol.minWidth();
                    const maxWidth = gridCol.maxWidth();
                    if (minWidth && calculatedWidth < minWidth) {
                        calculatedWidth = gridCol.minWidth();
                    } else if (maxWidth && calculatedWidth > maxWidth) {
                        calculatedWidth = maxWidth;
                    }
                    gridCol.calculatedWidth.set(calculatedWidth);
                }
            }
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
