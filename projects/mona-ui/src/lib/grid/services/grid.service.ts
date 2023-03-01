import { Injectable } from "@angular/core";
import { Column } from "../models/Column";
import { Dictionary, Enumerable } from "@mirei/ts-collections";
import { ColumnFilterState } from "../models/ColumnFilterState";
import { ColumnSortState } from "../models/ColumnSortState";
import { Row } from "../models/Row";

@Injectable()
export class GridService {
    public appliedFilters: Dictionary<string, ColumnFilterState> = new Dictionary<string, ColumnFilterState>();
    public appliedSorts: Dictionary<string, ColumnSortState> = new Dictionary<string, ColumnSortState>();
    public columns: Column[] = [];
    public gridHeaderElement?: HTMLDivElement;
    public pageState: { skip: number; take: number } = { skip: 0, take: 10 };
    public rows: Row[] = [];
    public constructor() {}

    public setRows(value: any[]): void {
        this.rows = Enumerable.from(value)
            .select(r => new Row(r))
            .toArray();
    }
}
