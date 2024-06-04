import { ChangeDetectionStrategy, Component, output } from "@angular/core";
import { EditorTableInsertEvent } from "../../models/EditorTableInsertEvent";

@Component({
    selector: "mona-editor-table-creator",
    standalone: true,
    imports: [],
    templateUrl: "./editor-table-creator.component.html",
    styleUrl: "./editor-table-creator.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorTableCreatorComponent {
    protected highlightedCell: { row: number; col: number } = { row: 0, col: 0 };
    public readonly insert = output<EditorTableInsertEvent>();

    public onCellClick(row: number, col: number): void {
        this.insert.emit({ row, col });
        this.highlightedCell = { row: 0, col: 0 };
    }

    public onCellMouseEnter(row: number, col: number): void {
        this.highlightedCell = { row, col };
    }

    public onCellMouseLeave(): void {
        this.highlightedCell = { row: 0, col: 0 };
    }
}
