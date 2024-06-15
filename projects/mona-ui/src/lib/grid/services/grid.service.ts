import { computed, Injectable, OutputEmitterRef, Signal, signal, TemplateRef, WritableSignal } from "@angular/core";
import { any, Dictionary, from, ImmutableDictionary, ImmutableList, ImmutableSet, select } from "@mirei/ts-collections";
import { BehaviorSubject, Subject } from "rxjs";
import { VirtualScrollOptions } from "../../common/models/VirtualScrollOptions";
import { Query } from "../../query/core/Query";
import { CompositeFilterDescriptor, FilterDescriptor } from "../../query/filter/FilterDescriptor";
import { SortDescriptor } from "../../query/sort/SortDescriptor";
import { CellEditEvent } from "../models/CellEditEvent";
import { Column } from "../models/Column";
import { ColumnFilterState } from "../models/ColumnFilterState";
import { ColumnSortState } from "../models/ColumnSortState";
import { EditableOptions } from "../models/EditableOptions";
import { GroupableOptions } from "../models/GroupableOptions";
import { GroupDescriptor } from "../models/GroupDescriptor";
import { PageState } from "../models/PageState";
import { Row } from "../models/Row";
import { SelectableOptions } from "../models/SelectableOptions";
import { SortableOptions } from "../models/SortableOptions";

@Injectable()
export class GridService {
    public readonly appliedFilters: WritableSignal<ImmutableDictionary<string, ColumnFilterState>> = signal(
        ImmutableDictionary.create()
    );
    public readonly appliedGroupSorts: WritableSignal<ImmutableDictionary<string, ColumnSortState>> = signal(
        ImmutableDictionary.create()
    );
    public readonly appliedSorts: WritableSignal<ImmutableDictionary<string, ColumnSortState>> = signal(
        ImmutableDictionary.create()
    );
    public readonly cellEdit$ = new Subject<CellEditEvent>();
    public readonly columns = signal<ImmutableList<Column>>(ImmutableList.create());
    public readonly detailColumnWidth = 34;
    public readonly filterLoad$ = new Subject<void>();
    public readonly groupColumnWidth = 34;
    public readonly groupColumns = signal<ImmutableSet<Column>>(ImmutableSet.create());
    public readonly groupHeaderRowWidth = computed(() => {
        const groupColumns = this.groupColumns();
        const columns = this.columns();
        const groupColumnWidth = this.groupColumnWidth;
        const groupColumnCount = groupColumns.size();
        const detailRowOffset = this.masterDetailTemplate() ? this.detailColumnWidth : 0;
        const columnListWidth = columns.aggregate((acc, c) => acc + (c.calculatedWidth() ?? c.width() ?? 0), 0);
        return groupColumnWidth * groupColumnCount + columnListWidth + detailRowOffset;
    });
    public readonly groupableOptions = signal<GroupableOptions>({ enabled: false });
    public readonly isInEditMode = signal(false);
    public readonly masterDetailRowWidth = computed(() => {
        const groupColumns = this.groupColumns();
        const columns = this.columns();
        const groupColumnWidth = this.groupColumnWidth;
        const groupColumnCount = groupColumns.size();
        const columnListWidth = columns.aggregate((acc, c) => acc + (c.calculatedWidth() ?? c.width() ?? 0), 0);
        return groupColumnWidth * (groupColumnCount + 1) + columnListWidth;
    });
    public readonly masterDetailEmptyCellWidth = computed(() => {
        return this.detailColumnWidth * (this.groupColumns().size() + 1);
    });
    public readonly masterDetailTemplate = signal<TemplateRef<any> | null>(null);
    public readonly pageState: PageState = { page: signal(1), skip: signal(0), take: signal(10) };
    public readonly rows = signal<ImmutableSet<Row>>(ImmutableSet.create());
    public readonly selectBy = signal("");
    public readonly selectedKeys = signal<ImmutableSet<unknown>>(ImmutableSet.create());
    public readonly selectedKeysLoad$ = new BehaviorSubject<ImmutableSet<unknown>>(ImmutableSet.create());
    public readonly selectedRows = signal<ImmutableSet<Row>>(ImmutableSet.create());
    public readonly selectedRowsChange$ = new Subject<Iterable<Row>>();
    public readonly sortLoad$ = new Subject<void>();
    public readonly viewPageRows: Signal<ImmutableSet<Row>> = computed(() => {
        const skip = this.pageState.skip();
        const take = this.pageState.take();
        const viewRows = this.viewRows();
        if (!viewRows.any()) {
            return ImmutableSet.create();
        }
        return viewRows.skip(skip).take(take).toImmutableSet();
    });
    public readonly viewRows: Signal<ImmutableSet<Row>> = computed(() => {
        const rows = this.rows();
        const appliedFilters = this.appliedFilters();
        const appliedSorts = this.appliedSorts();
        const groupColumns = this.groupColumns();

        let queryEnumerable = Query.from(rows);
        for (const filter of appliedFilters) {
            if (filter.value.filter) {
                queryEnumerable = queryEnumerable.filter(filter.value.filter, r => r.data);
            }
        }

        if (groupColumns.any()) {
            const groupDescriptors = this.getGroupDescriptors(groupColumns);
            const sortStates = groupDescriptors.map<SortDescriptor>(d => ({ field: d.field, dir: d.dir ?? "asc" }));
            queryEnumerable = queryEnumerable.sort(sortStates, r => r.data);
        }

        const appliedNonGroupSorts = appliedSorts
            .values()
            .where(state => !groupColumns.any(c => c.field() === state.sort.field));

        if (appliedNonGroupSorts.any()) {
            const sortState = appliedNonGroupSorts.select(d => d.sort).toArray();
            queryEnumerable = queryEnumerable.sort(sortState, r => r.data);
        }
        const result = queryEnumerable.run();
        return ImmutableSet.create(result);
    });
    public readonly viewRowCount = computed(() => this.viewRows().size());
    public readonly virtualScrollOptions = signal<VirtualScrollOptions>({ enabled: false, height: 28 });
    public editableOptions: EditableOptions = { enabled: false };
    public gridHeaderElement = signal<HTMLDivElement | null>(null);
    public gridGroupExpandState = new Dictionary<string, Dictionary<number, boolean>>();
    public selectableOptions: SelectableOptions = {
        enabled: false,
        mode: "single"
    };
    public selectedKeysChange!: OutputEmitterRef<unknown[]>;
    public sortableOptions: SortableOptions = {
        enabled: false,
        mode: "single",
        allowUnsort: true,
        showIndices: true
    };

    public deselectAllRows(): void {
        if (this.selectedRows().length !== 0) {
            this.selectedRows().forEach(r => r.selected.set(false));
        }
        this.selectedRows.update(set => set.clear());
    }

    public findTextWidthOfColumn(column: Column, element: HTMLTableCellElement): number {
        let longestValue = this.findLongestCellContentOfColumn(column);
        if (column.title().length > longestValue.length) {
            longestValue = column.title();
        }
        const div = document.createElement("canvas");
        const context = div.getContext("2d");
        if (context == null) {
            return 0;
        }
        const documentBodyStyle = window.getComputedStyle(document.body);
        const fontFamily = documentBodyStyle.getPropertyValue("font-family");
        const fontSize = documentBodyStyle.getPropertyValue("font-size");
        const titleElement = element.querySelector(".mona-grid-column-title");
        const actionsElement = element.querySelector(".mona-grid-column-actions");
        const actionsWidth = actionsElement ? actionsElement.clientWidth : 0;
        const leftRightPadding = titleElement
            ? parseInt(window.getComputedStyle(titleElement).paddingLeft, 10) +
              parseInt(window.getComputedStyle(titleElement).paddingRight, 10)
            : 0;
        const totalAdditionalWidth = actionsWidth + leftRightPadding;
        context.font = `${fontSize} ${fontFamily}`;
        return context.measureText(longestValue).width + totalAdditionalWidth;
    }

    public getGroupDescriptors(columns: Iterable<Column>): GroupDescriptor[] {
        return select(columns, c => ({
            field: c.field(),
            dir: c.groupSortDirection() ?? undefined
        })).toArray();
    }

    public handleMultipleSelection(event: MouseEvent, row: Row): void {
        if (!this.selectedRows().contains(row)) {
            this.selectRow(row);
        } else if (event.ctrlKey || event.metaKey) {
            row.selected.set(false);
            this.selectedRows.update(set => set.remove(row));
        }
    }

    public handleRowClick(event: MouseEvent, row: Row): void {
        if (!this.isSelectableGrid()) {
            return;
        }
        if (this.selectableOptions.mode === "single") {
            this.handleSingleSelection(event, row);
        } else {
            this.handleMultipleSelection(event, row);
        }
        this.selectedRowsChange$.next(this.selectedRows());
    }

    public handleSingleSelection(event: MouseEvent, row: Row): void {
        if (row.selected() && (event.ctrlKey || event.metaKey)) {
            this.deselectAllRows();
        } else {
            this.deselectAllRows();
            this.selectRow(row);
        }
    }

    public isSelectableGrid(): boolean {
        return this.selectableOptions != null && !!this.selectableOptions.enabled;
    }

    public loadFilters(filters: CompositeFilterDescriptor[]): void {
        const newAppliedFilters = new Dictionary<string, ColumnFilterState>();
        for (const filter of filters) {
            const filter1 = filter.filters[0] as FilterDescriptor;
            const filter2 = filter.filters[1] as FilterDescriptor;
            const column = this.columns().firstOrDefault(c => c.field() === filter1.field);
            if (column != null) {
                newAppliedFilters.add(column.field(), {
                    filter: filter,
                    filterMenuValue: {
                        value1: filter1 && "value" in filter1 ? filter1.value : undefined,
                        value2: filter2 && "value" in filter2 ? filter2.value : undefined,
                        operator1: filter1 ? filter1.operator : undefined,
                        operator2: filter2 ? filter2.operator : undefined,
                        logic: filter.logic || "and"
                    }
                });
            }
        }
        this.columns().forEach(c => c.filtered.set(newAppliedFilters.containsKey(c.field())));
        this.appliedFilters.set(
            newAppliedFilters.toImmutableDictionary(
                p => p.key,
                p => p.value
            )
        );
        this.filterLoad$.next();
    }

    public loadGroupColumns(descriptors: Iterable<GroupDescriptor>): void {
        const columns = this.columns();
        const groupColumns = columns.where(c => any(descriptors, d => d.field === c.field()));
        const currentGroupColumns = this.groupColumns();
        if (groupColumns.orderBy(c => c.field()).sequenceEqual(currentGroupColumns.orderBy(c => c.field()))) {
            return;
        }
        for (const descriptor of descriptors) {
            const column = columns.firstOrDefault(c => c.field() === descriptor.field);
            if (column != null) {
                column.groupSortDirection.set(descriptor.dir ?? "asc");
                this.appliedGroupSorts.update(v =>
                    v.add(column.field(), { sort: { field: descriptor.field, dir: descriptor.dir ?? "asc" } })
                );
            }
        }
        this.groupColumns.set(ImmutableSet.create(groupColumns));
    }

    public loadSelectedKeys(selectedKeys: Iterable<unknown>): void {
        this.selectedKeys.update(set => set.clear().addAll(selectedKeys));
        const selectedRowList: Row[] = [];
        for (const row of this.rows()) {
            const fieldData = this.selectBy() ? row.data[this.selectBy()] : row.data;
            if (fieldData == null) {
                continue;
            }
            row.selected.set(this.selectedKeys().contains(fieldData));
            if (row.selected()) {
                selectedRowList.push(row);
            }
        }
        this.selectedRows.update(set => set.clear().addAll(selectedRowList));
        this.selectedKeysLoad$.next(this.selectedKeys());
    }

    public loadSorts(sorts: SortDescriptor[]): void {
        const newAppliedSorts = new Dictionary<string, ColumnSortState>();
        for (const [index, sort] of sorts.entries()) {
            const column = this.columns().firstOrDefault(c => c.field() === sort.field);
            if (column != null) {
                newAppliedSorts.add(column.field(), {
                    sort: sort
                });
                column.sortIndex.set(index + 1);
                column.columnSortDirection.set(sort.dir);
            }
        }
        this.appliedSorts.set(
            newAppliedSorts.toImmutableDictionary(
                p => p.key,
                p => p.value
            )
        );
        this.sortLoad$.next();
    }

    public selectRow(row: Row): void {
        row.selected.set(true);
        this.selectedRows.update(set => set.add(row));
    }

    public setEditableOptions(options: EditableOptions): void {
        this.editableOptions = { ...this.editableOptions, ...options };
    }

    public setGroupableOptions(options: Partial<GroupableOptions>): void {
        this.groupableOptions.update(v => ({ ...v, ...options }));
    }

    public setRows(value: Iterable<any>): void {
        this.rows.set(ImmutableSet.create(from(value).select(r => new Row(r))));
    }

    public setSelectableOptions(options: SelectableOptions): void {
        this.selectableOptions = { ...this.selectableOptions, ...options };
    }

    public setSortableOptions(options: SortableOptions): void {
        this.sortableOptions = { ...this.sortableOptions, ...options };
    }

    public setVirtualScrollOptions(options: VirtualScrollOptions): void {
        this.virtualScrollOptions.update(v => ({ ...v, ...options }));
    }

    private findLongestCellContentOfColumn(column: Column): string {
        let maxLength = 0;
        let longestValue = "";
        for (const row of this.rows()) {
            const value = row.data[column.field()];
            if (value != null) {
                maxLength = Math.max(maxLength, value.toString().length);
                if (maxLength === value.toString().length) {
                    longestValue = value.toString();
                }
            }
        }
        return longestValue;
    }
}
