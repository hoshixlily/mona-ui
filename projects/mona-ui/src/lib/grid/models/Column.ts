import { ColumnOptions } from "./ColumnOptions";

export class Column {
    public calculatedWidth?: number;
    public field: string;
    public maxWidth?: number;
    public minWidth: number = 40;
    public title: string;
    public width?: number;

    public constructor(options: ColumnOptions) {
        this.field = options.field;
        this.title = options.title;
        this.width = options.width;
        this.maxWidth = options.maxWidth;
        this.minWidth = options.minWidth ?? this.minWidth;
        this.calculatedWidth = options.width;
    }
}
