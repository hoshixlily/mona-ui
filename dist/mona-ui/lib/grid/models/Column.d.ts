import { FilterFieldType } from "../../filter/models/FilterFieldType";
import { GridCellTemplateDirective } from "../directives/grid-cell-template.directive";
export declare class Column {
    calculatedWidth?: number;
    cellTemplate?: GridCellTemplateDirective;
    field: string;
    filterType: FilterFieldType;
    filtered: boolean;
    index: number;
    maxWidth?: number;
    minWidth: number;
    sortDirection?: "asc" | "desc";
    sortIndex?: number;
    title: string;
    width?: number;
    constructor();
}
