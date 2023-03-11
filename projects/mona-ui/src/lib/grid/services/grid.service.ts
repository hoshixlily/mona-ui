import { EventEmitter, Injectable } from "@angular/core";
import { Column } from "../models/Column";
import { Dictionary, Enumerable, EnumerableSet } from "@mirei/ts-collections";
import { ColumnFilterState } from "../models/ColumnFilterState";
import { ColumnSortState } from "../models/ColumnSortState";
import { Row } from "../models/Row";
import { SelectableOptions } from "../models/SelectableOptions";
import { Subject } from "rxjs";

@Injectable()
export class GridService {
    public readonly selectedRowsChange$: Subject<Row[]> = new Subject<Row[]>();
    public appliedFilters: Dictionary<string, ColumnFilterState> = new Dictionary<string, ColumnFilterState>();
    public appliedSorts: Dictionary<string, ColumnSortState> = new Dictionary<string, ColumnSortState>();
    public columns: Column[] = [];
    public gridHeaderElement?: HTMLDivElement;
    public groupColumns: Column[] = [];
    public gridGroupExpandState: Dictionary<string, Dictionary<number, boolean>> = new Dictionary<
        string,
        Dictionary<number, boolean>
    >();
    public pageState: { page: number; skip: number; take: number } = { page: 1, skip: 0, take: 10 };
    public rows: Row[] = [];
    public selectedKeys: EnumerableSet<unknown> = new EnumerableSet<unknown>();
    public selectionKeyField: string = ""; // set by GridSelectableDirective
    public selectableSettings: SelectableOptions = {
        enabled: false,
        mode: "multiple"
    };
    public selectedKeysChange: EventEmitter<unknown[]> = new EventEmitter<unknown[]>();
    public selectedRows: Row[] = [];

    public constructor() {}

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

    public setRows(value: any[]): void {
        this.rows = Enumerable.from(value)
            .select(r => new Row(r))
            .toArray();
    }

    public setSelectableOptions(options: SelectableOptions): void {
        this.selectableSettings = { ...this.selectableSettings, ...options };
    }
}
