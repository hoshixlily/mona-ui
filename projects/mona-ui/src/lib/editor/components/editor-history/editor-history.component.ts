import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faRedo, faUndo } from "@fortawesome/free-solid-svg-icons";
import { ButtonGroupComponent } from "../../../buttons/button-group/button-group.component";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { EditorService } from "../../services/editor.service";

@Component({
    selector: "mona-editor-history",
    standalone: true,
    imports: [ButtonGroupComponent, FaIconComponent, ButtonDirective],
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
    protected readonly redoIcon = faRedo;
    protected readonly undoDisabled = computed(() => {
        this.#editorService.state();
        return !this.#editorService.editor.can().undo();
    });
    protected readonly undoIcon = faUndo;

    public onRedoClick(): void {
        this.#editorService.editor.chain().focus().redo().run();
    }

    public onUndoClick(): void {
        this.#editorService.editor.chain().focus().undo().run();
    }
}
