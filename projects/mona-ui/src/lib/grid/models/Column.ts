import { DataType } from "../../models/DataType";
import { GridCellTemplateDirective } from "../directives/grid-cell-template.directive";
import { GridColumnTitleTemplateDirective } from "../directives/grid-column-title-template.directive";

export class Column {
    /**
     * Only used internally for column resizing
     */
    public calculatedWidth?: number;
    public cellTemplate?: GridCellTemplateDirective;
    public dataType: DataType = "string";
    public field: string = "";
    public filtered: boolean = false;
    public index: number = 0; // 0-based
    public maxWidth?: number;
    public minWidth: number = 40;
    public sortDirection?: "asc" | "desc";
    public sortIndex?: number; // 1-based
    public title: string = "";
    public titleTemplate?: GridColumnTitleTemplateDirective;
    public width?: number;

    public constructor() {}
}
