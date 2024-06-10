import { ChangeDetectionStrategy, Component, contentChild, effect, input, TemplateRef, untracked } from "@angular/core";
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
export class GridColumnComponent {
    protected readonly cellTemplate = contentChild(GridCellTemplateDirective, { read: TemplateRef });
    protected readonly titleTemplate = contentChild(GridColumnTitleTemplateDirective, { read: TemplateRef });

    public readonly column = new Column();
    public readonly editable = input<boolean>(true);
    public readonly field = input<string>("");
    public readonly maxWidth = input<number | null>(null);
    public readonly minWidth = input<number>(40);
    public readonly title = input<string>("");
    public readonly type = input<DataType>("string");
    public readonly width = input<number | undefined>(undefined);

    public constructor() {
        effect(() => {
            const cellTemplate = this.cellTemplate();
            untracked(() => this.column.cellTemplate.set(cellTemplate ?? null));
        });
        effect(() => {
            const editable = this.editable();
            untracked(() => this.column.editable.set(editable));
        });
        effect(() => {
            const field = this.field();
            untracked(() => this.column.field.set(field));
        });
        effect(() => {
            const maxWidth = this.maxWidth();
            untracked(() => this.column.maxWidth.set(maxWidth));
        });
        effect(() => {
            const minWidth = this.minWidth();
            untracked(() => this.column.minWidth.set(minWidth));
        });
        effect(() => {
            const title = this.title();
            untracked(() => this.column.title.set(title));
        });
        effect(() => {
            const titleTemplate = this.titleTemplate();
            untracked(() => this.column.titleTemplate.set(titleTemplate ?? null));
        });
        effect(() => {
            const type = this.type();
            untracked(() => this.column.dataType.set(type));
        });
        effect(() => {
            const width = this.width();
            untracked(() => this.column.width.set(width));
        });
    }
}
