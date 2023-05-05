import { FilterFieldType } from "../../filter/models/FilterFieldType";
export interface ColumnOptions {
    maxWidth?: number;
    minWidth?: number;
    field: string;
    filterType?: FilterFieldType;
    title: string;
    width?: number;
}
