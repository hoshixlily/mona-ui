import { Component, ContentChild, Input, OnInit } from "@angular/core";
import { Column } from "../../models/Column";
import { GridCellTemplateDirective } from "../../directives/grid-cell-template.directive";
import { DataType } from "../../../models/DataType";
import { GridColumnTitleTemplateDirective } from "../../directives/grid-column-title-template.directive";

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

    @ContentChild(GridColumnTitleTemplateDirective)
    public set titleTemplate(value: GridColumnTitleTemplateDirective) {
        this.column.titleTemplate = value;
    }

    @Input()
    public set type(value: DataType) {
        this.column.dataType = value;
    }

    @Input()
    public set width(value: number) {
        this.column.width = value;
    }

    public constructor() {}

    public ngOnInit(): void {}
}
