import { EventEmitter, Injectable } from "@angular/core";
import { Column } from "../models/Column";
import { Dictionary, Enumerable, EnumerableSet } from "@mirei/ts-collections";
import { ColumnFilterState } from "../models/ColumnFilterState";
import { ColumnSortState } from "../models/ColumnSortState";
import { Row } from "../models/Row";
import { SelectableOptions } from "../models/SelectableOptions";
import { Subject } from "rxjs";
import { CompositeFilterDescriptor, FilterDescriptor } from "../../query/filter/FilterDescriptor";
import { SortableOptions } from "../models/SortableOptions";
import { SortDescriptor } from "../../query/sort/SortDescriptor";

@Injectable()
export class GridService {
    public readonly selectedRowsChange$: Subject<Row[]> = new Subject<Row[]>();
    public appliedFilters: Dictionary<string, ColumnFilterState> = new Dictionary<string, ColumnFilterState>();
    public appliedSorts: Dictionary<string, ColumnSortState> = new Dictionary<string, ColumnSortState>();
    public columns: Column[] = [];
    public filterLoad$: Subject<void> = new Subject<void>();
    public gridHeaderElement?: HTMLDivElement;
    public groupColumns: Column[] = [];
    public gridGroupExpandState: Dictionary<string, Dictionary<number, boolean>> = new Dictionary<
        string,
        Dictionary<number, boolean>
    >();
    public isInEditMode: boolean = false;
    public pageState: { page: number; skip: number; take: number } = { page: 1, skip: 0, take: 10 };
    public rows: Row[] = [];
    public selectedKeys: EnumerableSet<unknown> = new EnumerableSet<unknown>();
    public selectionKeyField: string = ""; // set by GridSelectableDirective
    public selectableOptions: SelectableOptions = {
        enabled: false,
        mode: "multiple"
    };
    public selectedKeysChange: EventEmitter<unknown[]> = new EventEmitter<unknown[]>();
    public selectedRows: Row[] = [];
    public sortLoad$: Subject<void> = new Subject<void>();
    public sortableOptions: SortableOptions = {
        enabled: false,
        mode: "single",
        allowUnsort: false,
        showIndices: true
    };

    public constructor() {}

    public loadFilters(filters: CompositeFilterDescriptor[]): void {
        const newAppliedFilters = new Dictionary<string, ColumnFilterState>();
        for (const filter of filters) {
            const filter1 = filter.filters[0] as FilterDescriptor;
            const filter2 = filter.filters[1] as FilterDescriptor;
            const column = this.columns.find(c => c.field === filter1.field);
            if (column != null) {
                newAppliedFilters.add(column.field, {
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
        this.columns.forEach(c => (c.filtered = newAppliedFilters.containsKey(c.field)));
        this.appliedFilters = newAppliedFilters;
        this.filterLoad$.next();
    }

    public loadSelectedKeys(selectedKeys: Iterable<unknown>): void {
        this.selectedRows = [];
        this.selectedKeys = new EnumerableSet<unknown>(selectedKeys);
        for (const row of this.rows) {
            const fieldData = this.selectionKeyField ? row.data[this.selectionKeyField] : row.data;
            if (fieldData == null) {
                continue;
            }
            row.selected = this.selectedKeys.contains(fieldData);
            if (row.selected) {
                this.selectedRows = [...this.selectedRows, row];
            }
        }
    }

    public loadSorts(sorts: SortDescriptor[]): void {
        const newAppliedSorts = new Dictionary<string, ColumnSortState>();
        for (const [index, sort] of sorts.entries()) {
            const column = this.columns.find(c => c.field === sort.field);
            if (column != null) {
                newAppliedSorts.add(column.field, {
                    sort: sort
                });
                column.sortIndex = index + 1;
                column.sortDirection = sort.dir;
            }
        }
        this.appliedSorts = newAppliedSorts;
        this.sortLoad$.next();
    }

    public setRows(value: any[]): void {
        this.rows = Enumerable.from(value)
            .select(r => new Row(r))
            .toArray();
    }

    public setSelectableOptions(options: SelectableOptions): void {
        this.selectableOptions = { ...this.selectableOptions, ...options };
    }

    public setSortableOptions(options: SortableOptions): void {
        this.sortableOptions = { ...this.sortableOptions, ...options };
    }
}
