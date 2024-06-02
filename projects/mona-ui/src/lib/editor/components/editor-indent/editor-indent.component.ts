import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { ButtonGroupComponent } from "../../../buttons/button-group/button-group.component";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { EditorService } from "../../services/editor.service";

@Component({
    selector: "mona-editor-indent",
    standalone: true,
    imports: [ButtonGroupComponent, ButtonDirective],
    templateUrl: "./editor-indent.component.html",
    styleUrl: "./editor-indent.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorIndentComponent {
    readonly #editorService: EditorService = inject(EditorService);
    protected readonly indentDisabled = computed(() => {
        this.#editorService.state();
        return !this.#editorService.editor.can().indent();
    });
    protected readonly outdentDisabled = computed(() => {
        this.#editorService.state();
        return !this.#editorService.editor.can().outdent();
    });

    public onIndentClick(): void {
        this.#editorService.editor.chain().focus().indent().run();
    }

    public onOutdentClick(): void {
        this.#editorService.editor.chain().focus().outdent().run();
    }
}
