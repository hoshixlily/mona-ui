import { ColumnOptions } from "./ColumnOptions";
import { FilterFieldType } from "../../filter/models/FilterFieldType";

export class Column {
    public calculatedWidth?: number;
    public field: string;
    public filterType: FilterFieldType = "string";
    public filtered: boolean = false;
    public maxWidth?: number;
    public minWidth: number = 40;
    public sortDirection?: "asc" | "desc";
    public title: string;
    public width?: number;

    public constructor(options: ColumnOptions) {
        this.field = options.field;
        this.title = options.title;
        this.width = options.width;
        this.maxWidth = options.maxWidth;
        this.minWidth = options.minWidth ?? this.minWidth;
        this.calculatedWidth = options.width;
        this.filterType = options.filterType ?? this.filterType;
    }
}
