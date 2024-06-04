import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { EditorService } from "../../services/editor.service";

@Component({
    selector: "mona-editor-code-block",
    standalone: true,
    imports: [ButtonDirective],
    templateUrl: "./editor-code-block.component.html",
    styleUrl: "./editor-code-block.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorCodeBlockComponent {
    readonly #editorService: EditorService = inject(EditorService);
    protected readonly codeBlockSelected = computed(() => {
        this.#editorService.state();
        return this.#editorService.editor.isActive("codeBlock");
    });

    public onCodeBlockClick(): void {
        this.#editorService.editor.chain().toggleCodeBlock().run();
    }
}
