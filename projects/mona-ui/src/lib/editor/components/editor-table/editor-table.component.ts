import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from "@angular/core";
import { ButtonGroupComponent } from "../../../buttons/button-group/button-group.component";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { PopoverComponent } from "../../../tooltips/popover/components/popover/popover.component";
import { EditorTableInsertEvent } from "../../models/EditorTableInsertEvent";
import { EditorService } from "../../services/editor.service";
import { EditorTableCreatorComponent } from "../editor-table-creator/editor-table-creator.component";

@Component({
    selector: "mona-editor-table",
    standalone: true,
    imports: [ButtonGroupComponent, ButtonDirective, PopoverComponent, EditorTableCreatorComponent],
    templateUrl: "./editor-table.component.html",
    styleUrl: "./editor-table.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorTableComponent {
    readonly #editorService: EditorService = inject(EditorService);
    protected readonly addColumnBeforeDisabled = computed(() => {
        this.#editorService.state();
        const isTable = this.#editorService.editor.isActive("table");
        const canAddColumnBefore = this.#editorService.editor.can().addColumnBefore();
        return !isTable || !canAddColumnBefore;
    });
    protected readonly addColumnAfterDisabled = computed(() => {
        this.#editorService.state();
        const isTable = this.#editorService.editor.isActive("table");
        const canAddColumnAfter = this.#editorService.editor.can().addColumnAfter();
        return !isTable || !canAddColumnAfter;
    });
    protected readonly addRowBeforeDisabled = computed(() => {
        this.#editorService.state();
        const isTable = this.#editorService.editor.isActive("table");
        const canAddRowBefore = this.#editorService.editor.can().addRowBefore();
        return !isTable || !canAddRowBefore;
    });
    protected readonly addRowAfterDisabled = computed(() => {
        this.#editorService.state();
        const isTable = this.#editorService.editor.isActive("table");
        const canAddRowAfter = this.#editorService.editor.can().addRowAfter();
        return !isTable || !canAddRowAfter;
    });
    protected readonly deleteColumnDisabled = computed(() => {
        this.#editorService.state();
        const isTable = this.#editorService.editor.isActive("table");
        const canDeleteColumn = this.#editorService.editor.can().deleteColumn();
        return !isTable || !canDeleteColumn;
    });
    protected readonly deleteRowDisabled = computed(() => {
        this.#editorService.state();
        const isTable = this.#editorService.editor.isActive("table");
        const canDeleteRow = this.#editorService.editor.can().deleteRow();
        return !isTable || !canDeleteRow;
    });
    protected readonly deleteTableDisabled = computed(() => {
        this.#editorService.state();
        const isTable = this.#editorService.editor.isActive("table");
        const canDeleteTable = this.#editorService.editor.can().deleteTable();
        return !isTable || !canDeleteTable;
    });
    protected readonly mergeCellsDisabled = computed(() => {
        this.#editorService.state();
        const isTable = this.#editorService.editor.isActive("table");
        const canMergeCells = this.#editorService.editor.can().mergeCells();
        return !isTable || !canMergeCells;
    });
    protected readonly splitCellDisabled = computed(() => {
        this.#editorService.state();
        const isTable = this.#editorService.editor.isActive("table");
        const canSplitCell = this.#editorService.editor.can().splitCell();
        return !isTable || !canSplitCell;
    });
    protected readonly popover = viewChild<PopoverComponent>("popoverComponent");

    public onAddColumnBeforeClick(): void {
        this.#editorService.editor.chain().focus().addColumnBefore().run();
    }

    public onAddColumnAfterClick(): void {
        this.#editorService.editor.chain().focus().addColumnAfter().run();
    }

    public onAddRowBeforeClick(): void {
        this.#editorService.editor.chain().focus().addRowBefore().run();
    }

    public onAddRowAfterClick(): void {
        this.#editorService.editor.chain().focus().addRowAfter().run();
    }

    public onDeleteColumnClick(): void {
        this.#editorService.editor.chain().focus().deleteColumn().run();
    }

    public onDeleteRowClick(): void {
        this.#editorService.editor.chain().focus().deleteRow().run();
    }

    public onDeleteTableClick(): void {
        this.#editorService.editor.chain().focus().deleteTable().run();
    }

    public onMergeCellsClick(): void {
        this.#editorService.editor.chain().focus().mergeCells().run();
    }

    public onSplitCellClick(): void {
        this.#editorService.editor.chain().focus().splitCell().run();
    }

    public onTableInsert(event: EditorTableInsertEvent): void {
        this.popover()?.close();
        this.#editorService.editor.commands.insertTable({
            rows: event.row,
            cols: event.col
        });
    }
}
