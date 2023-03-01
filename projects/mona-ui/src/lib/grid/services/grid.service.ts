import { Injectable } from "@angular/core";
import { Column } from "../models/Column";
import { Dictionary } from "@mirei/ts-collections";
import { ColumnFilterState } from "../models/ColumnFilterState";
import { ColumnSortState } from "../models/ColumnSortState";

@Injectable()
export class GridService {
    public appliedFilters: Dictionary<string, ColumnFilterState> = new Dictionary<string, ColumnFilterState>();
    public appliedSorts: Dictionary<string, ColumnSortState> = new Dictionary<string, ColumnSortState>();
    public columns: Column[] = [];
    public gridHeaderElement?: HTMLDivElement;
    public groupColumns: Column[] = [];
    public pageState: { skip: number; take: number } = { skip: 0, take: 10 };
    public rows: any[] = [];
    public constructor() {}
}
