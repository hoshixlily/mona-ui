import { computed, Injectable, output, OutputEmitterRef, Signal, signal, WritableSignal } from "@angular/core";
import { Dictionary, from, ImmutableDictionary, ImmutableList, ImmutableSet } from "@mirei/ts-collections";
import { Subject } from "rxjs";
import { Query } from "../../query/core/Query";
import { CompositeFilterDescriptor, FilterDescriptor } from "../../query/filter/FilterDescriptor";
import { SortDescriptor } from "../../query/sort/SortDescriptor";
import { CellEditEvent } from "../models/CellEditEvent";
import { Column } from "../models/Column";
import { ColumnFilterState } from "../models/ColumnFilterState";
import { ColumnSortState } from "../models/ColumnSortState";
import { EditableOptions } from "../models/EditableOptions";
import { PageState } from "../models/PageState";
import { Row } from "../models/Row";
import { SelectableOptions } from "../models/SelectableOptions";
import { SortableOptions } from "../models/SortableOptions";

@Injectable()
export class GridService {
    public readonly appliedFilters: WritableSignal<ImmutableDictionary<string, ColumnFilterState>> = signal(
        ImmutableDictionary.create()
    );
    public readonly appliedSorts: WritableSignal<ImmutableDictionary<string, ColumnSortState>> = signal(
        ImmutableDictionary.create()
    );
    public readonly cellEdit$: Subject<CellEditEvent> = new Subject<CellEditEvent>();
    public readonly columns: WritableSignal<ImmutableList<Column>> = signal(ImmutableList.create());
    public readonly filterLoad$: Subject<void> = new Subject<void>();
    public readonly groupColumns: WritableSignal<Array<Column>> = signal([]);
    public readonly isInEditMode: WritableSignal<boolean> = signal(false);
    public readonly pageState: PageState = { page: signal(1), skip: signal(0), take: signal(10) };
    public readonly rows: WritableSignal<ImmutableSet<Row>> = signal(ImmutableSet.create());
    public readonly selectedKeys: WritableSignal<ImmutableSet<unknown>> = signal(ImmutableSet.create());
    public readonly selectedRows: WritableSignal<ImmutableSet<Row>> = signal(ImmutableSet.create());
    public readonly selectedRowsChange$: Subject<Iterable<Row>> = new Subject<Iterable<Row>>();
    public readonly selectionKeyField: WritableSignal<string> = signal("");
    public readonly sortLoad$: Subject<void> = new Subject<void>();
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

        let queryEnumerable = Query.from(rows);
        for (const filter of appliedFilters) {
            if (filter.value.filter) {
                queryEnumerable = queryEnumerable.filter(filter.value.filter, r => r.data);
            }
        }
        if (appliedSorts.any()) {
            const sortState = appliedSorts
                .values()
                .select(d => d.sort)
                .toArray();
            queryEnumerable = queryEnumerable.sort(sortState, r => r.data);
        }
        const result = queryEnumerable.run();
        return ImmutableSet.create(result);
    });
    public readonly viewRowCount: Signal<number> = computed(() => this.viewRows().size());
    public editableOptions: EditableOptions = { enabled: false };
    public gridHeaderElement?: HTMLDivElement;
    public gridGroupExpandState: Dictionary<string, Dictionary<number, boolean>> = new Dictionary<
        string,
        Dictionary<number, boolean>
    >();
    public selectableOptions: SelectableOptions = {
        enabled: false,
        mode: "single"
    };
    public selectedKeysChange: OutputEmitterRef<unknown[]> = output();
    public sortableOptions: SortableOptions = {
        enabled: false,
        mode: "single",
        allowUnsort: false,
        showIndices: true
    };

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

    public loadSelectedKeys(selectedKeys: Iterable<unknown>): void {
        this.selectedKeys.update(set => set.clear().addAll(selectedKeys));
        const selectedRowList: Row[] = [];
        for (const row of this.rows()) {
            const fieldData = this.selectionKeyField() ? row.data[this.selectionKeyField()] : row.data;
            if (fieldData == null) {
                continue;
            }
            row.selected.set(this.selectedKeys().contains(fieldData));
            if (row.selected()) {
                selectedRowList.push(row);
            }
        }
        this.selectedRows.update(set => set.clear().addAll(selectedRowList));
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
                column.sortDirection.set(sort.dir);
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

    public setEditableOptions(options: EditableOptions): void {
        this.editableOptions = { ...this.editableOptions, ...options };
    }

    public setRows(value: any[]): void {
        this.rows.set(ImmutableSet.create(from(value).select(r => new Row(r))));
    }

    public setSelectableOptions(options: SelectableOptions): void {
        this.selectableOptions = { ...this.selectableOptions, ...options };
    }

    public setSortableOptions(options: SortableOptions): void {
        this.sortableOptions = { ...this.sortableOptions, ...options };
    }
}
