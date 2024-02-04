import { ChangeDetectionStrategy, Component, ContentChild, Input, OnInit } from "@angular/core";
import { DataType } from "../../../models/DataType";
import { GridCellTemplateDirective } from "../../directives/grid-cell-template.directive";
import { GridColumnTitleTemplateDirective } from "../../directives/grid-column-title-template.directive";
import { Column } from "../../models/Column";

@Component({
    selector: "mona-grid-column",
    template: "",
    styleUrls: [],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridColumnComponent implements OnInit {
    public column: Column = new Column();

    @ContentChild(GridCellTemplateDirective)
    public set cellTemplate(value: GridCellTemplateDirective) {
        this.column.cellTemplate = value;
    }

    @Input()
    public set editable(value: boolean) {
        this.column.editable = value;
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
