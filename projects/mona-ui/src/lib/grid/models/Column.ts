import { signal, WritableSignal } from "@angular/core";
import { DataType } from "../../models/DataType";
import { GridCellTemplateDirective } from "../directives/grid-cell-template.directive";
import { GridColumnTitleTemplateDirective } from "../directives/grid-column-title-template.directive";

export class Column {
    /**
     * Only used internally for column resizing
     */
    public calculatedWidth: WritableSignal<number | undefined> = signal(undefined);
    public cellTemplate?: GridCellTemplateDirective;
    public dataType: DataType = "string";
    public editable: boolean = true;
    public field: string = "";
    public filtered: boolean = false;
    public index: WritableSignal<number> = signal(0); // 0-based
    public maxWidth?: number;
    public minWidth: number = 40;
    public sortDirection: WritableSignal<"asc" | "desc" | null> = signal(null);
    public sortIndex: WritableSignal<number | null> = signal(null); // 1-based
    public title: string = "";
    public titleTemplate?: GridColumnTitleTemplateDirective;
    public width?: number;
}
