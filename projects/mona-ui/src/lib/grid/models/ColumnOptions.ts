import { DataType } from "../../models/DataType";

export interface ColumnOptions {
    dataType?: DataType;
    field: string;
    maxWidth?: number;
    minWidth?: number;
    title: string;
    width?: number;
}
