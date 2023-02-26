import { Component, ContentChild, Input, OnInit } from "@angular/core";
import { Column } from "../../models/Column";
import { GridCellTemplateDirective } from "../../directives/grid-cell-template.directive";
import { FilterFieldType } from "../../../filter/models/FilterFieldType";

@Component({
    selector: "mona-grid-column",
    template: "",
    styleUrls: []
})
export class GridColumnComponent implements OnInit {
    public column: Column = new Column();

    @ContentChild(GridCellTemplateDirective)
    public set cellTemplate(value: GridCellTemplateDirective) {
        this.column.cellTemplate = value;
    }

    @Input()
    public set field(value: string) {
        this.column.field = value;
    }

    @Input()
    public set filterType(value: FilterFieldType) {
        this.column.filterType = value;
    }

    @Input()
    public set maxWidth(value: number) {
        this.column.maxWidth = value;
    }

    @Input()
    public set minWidth(value: number) {
        this.column.minWidth = value;
    }

    @Input()
    public set title(value: string) {
        this.column.title = value;
    }

    @Input()
    public set width(value: number) {
        this.column.width = value;
    }

    public constructor() {}

    public ngOnInit(): void {}
}
