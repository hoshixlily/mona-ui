import { Signal, signal, TemplateRef, WritableSignal } from "@angular/core";
import { DataType } from "../../models/DataType";
import { SortDirection } from "../../query/sort/SortDescriptor";
import { GridCellTemplateDirective } from "../directives/grid-cell-template.directive";
import { GridColumnTitleTemplateDirective } from "../directives/grid-column-title-template.directive";

export class Column {
    /**
     * Only used internally for column resizing
     */
    public calculatedWidth = signal<number | undefined>(undefined);
    public cellTemplate = signal<TemplateRef<any> | null>(null);
    public dataType = signal<DataType>("string");
    public editable = signal(false);
    public field = signal("");
    public filtered = signal(false);
    public index = signal(0); // 0-based
    public maxWidth = signal<number | null>(null);
    public minWidth = signal(40);
    public sortDirection = signal<SortDirection | null>(null);
    public sortIndex = signal<number | null>(null); // 1-based
    public title = signal("");
    public titleTemplate = signal<TemplateRef<any> | null>(null);
    public width = signal<number | undefined>(undefined);
}
