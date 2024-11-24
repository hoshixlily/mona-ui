import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { ButtonGroupComponent } from "../../../buttons/button-group/button-group.component";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { EditorService } from "../../services/editor.service";

@Component({
    selector: "mona-editor-history",
    imports: [ButtonGroupComponent, ButtonDirective],
    templateUrl: "./editor-history.component.html",
    styleUrl: "./editor-history.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorHistoryComponent {
    readonly #editorService: EditorService = inject(EditorService);
    protected readonly redoDisabled = computed(() => {
        this.#editorService.state();
        return !this.#editorService.editor.can().redo();
    });
    protected readonly undoDisabled = computed(() => {
        this.#editorService.state();
        return !this.#editorService.editor.can().undo();
    });

    public onRedoClick(): void {
        this.#editorService.editor.chain().focus().redo().run();
    }

    public onUndoClick(): void {
        this.#editorService.editor.chain().focus().undo().run();
    }
}
