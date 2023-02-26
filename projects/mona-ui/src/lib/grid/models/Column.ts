import { ColumnOptions } from "./ColumnOptions";
import { FilterFieldType } from "../../filter/models/FilterFieldType";
import { GridCellTemplateDirective } from "../directives/grid-cell-template.directive";

export class Column {
    public calculatedWidth?: number;
    public cellTemplate?: GridCellTemplateDirective;
    public field: string = "";
    public filterType: FilterFieldType = "string";
    public filtered: boolean = false;
    public maxWidth?: number;
    public minWidth: number = 40;
    public sortDirection?: "asc" | "desc";
    public sortIndex?: number; // 1-based
    public title: string = "";
    public width?: number;

    public constructor() {}
}
