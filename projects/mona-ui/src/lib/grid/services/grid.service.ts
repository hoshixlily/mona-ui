import { ElementRef, Injectable } from "@angular/core";
import { Column } from "../models/Column";
import { Dictionary } from "@mirei/ts-collections";
import { ColumnFilterState } from "../models/ColumnFilterState";
import { ColumnSortState } from "../models/ColumnSortState";
import { TempGridData } from "../models/TempGridData";

@Injectable()
export class GridService {
    public appliedFilters: Dictionary<string, ColumnFilterState> = new Dictionary<string, ColumnFilterState>();
    public appliedSorts: Dictionary<string, ColumnSortState> = new Dictionary<string, ColumnSortState>();
    public columns: Column[] = [
        new Column({ field: "name", title: "Name", filterType: "string" }),
        new Column({ field: "age", title: "Age", filterType: "number" }),
        new Column({ field: "gender", title: "Gender", filterType: "string" }),
        new Column({ field: "address", title: "Address", filterType: "string" }),
        new Column({ field: "city", title: "City", filterType: "string" }),
        new Column({ field: "zip", title: "Zip", filterType: "number" }),
        new Column({ field: "country", title: "Country", filterType: "string" }),
        new Column({ field: "phone", title: "Phone", filterType: "string" }),
        new Column({ field: "email", title: "Email", filterType: "string" }),
        new Column({ field: "company", title: "Company", filterType: "string" }),
        new Column({ field: "occupation", title: "Occupation", filterType: "string" }),
        new Column({ field: "favorite_color", title: "Favorite Color", filterType: "string" }),
        new Column({ field: "favorite_food", title: "Favorite Food", filterType: "string" })
    ];

    public gridHeaderElement?: HTMLDivElement;

    public rows: any[] = TempGridData;
    public constructor() {}
}
