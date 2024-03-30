import { Signal, signal, TemplateRef, WritableSignal } from "@angular/core";
import { DataType } from "../../models/DataType";
import { GridCellTemplateDirective } from "../directives/grid-cell-template.directive";
import { GridColumnTitleTemplateDirective } from "../directives/grid-column-title-template.directive";

export class Column {
    /**
     * Only used internally for column resizing
     */
    public calculatedWidth: WritableSignal<number | undefined> = signal(undefined);
    public cellTemplate: WritableSignal<TemplateRef<any> | null> = signal(null);
    public dataType: WritableSignal<DataType> = signal("string");
    public editable: WritableSignal<boolean> = signal(false);
    public field: WritableSignal<string> = signal("");
    public filtered: WritableSignal<boolean> = signal(false);
    public index: WritableSignal<number> = signal(0); // 0-based
    public maxWidth: WritableSignal<number | null> = signal(null);
    public minWidth: WritableSignal<number> = signal(40);
    public sortDirection: WritableSignal<"asc" | "desc" | null> = signal(null);
    public sortIndex: WritableSignal<number | null> = signal(null); // 1-based
    public title: WritableSignal<string> = signal("");
    public titleTemplate: WritableSignal<TemplateRef<any> | null> = signal(null);
    public width: WritableSignal<number | undefined> = signal(undefined);
}
