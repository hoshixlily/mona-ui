import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faIndent, faOutdent } from "@fortawesome/free-solid-svg-icons";
import { ButtonGroupComponent } from "../../../buttons/button-group/button-group.component";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { EditorService } from "../../services/editor.service";

@Component({
    selector: "mona-editor-indent",
    standalone: true,
    imports: [ButtonGroupComponent, ButtonDirective, FaIconComponent],
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
    protected readonly indentIcon = faIndent;
    protected readonly outdentDisabled = computed(() => {
        this.#editorService.state();
        return !this.#editorService.editor.can().outdent();
    });
    protected readonly outdentIcon = faOutdent;

    public onIndentClick(): void {
        this.#editorService.editor.chain().focus().indent().run();
    }

    public onOutdentClick(): void {
        this.#editorService.editor.chain().focus().outdent().run();
    }
}
