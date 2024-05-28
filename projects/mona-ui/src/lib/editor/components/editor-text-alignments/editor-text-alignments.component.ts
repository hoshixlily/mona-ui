import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight } from "@fortawesome/free-solid-svg-icons";
import { ButtonGroupComponent } from "../../../buttons/button-group/button-group.component";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { EditorService } from "../../services/editor.service";

@Component({
    selector: "mona-editor-text-alignments",
    standalone: true,
    imports: [ButtonGroupComponent, ButtonDirective, FaIconComponent],
    templateUrl: "./editor-text-alignments.component.html",
    styleUrl: "./editor-text-alignments.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorTextAlignmentsComponent {
    readonly #editorService: EditorService = inject(EditorService);
    protected readonly alignCenterIcon = faAlignCenter;
    protected readonly alignCenterSelected = computed(() => {
        this.#editorService.state();
        return this.#editorService.editor.isActive({ textAlign: "center" });
    });
    protected readonly alignJustifyIcon = faAlignJustify;
    protected readonly alignJustifySelected = computed(() => {
        this.#editorService.state();
        return this.#editorService.editor.isActive({ textAlign: "justify" });
    });
    protected readonly alignLeftIcon = faAlignLeft;
    protected readonly alignLeftSelected = computed(() => {
        this.#editorService.state();
        return this.#editorService.editor.isActive({ textAlign: "left" });
    });
    protected readonly alignRightIcon = faAlignRight;
    protected readonly alignRightSelected = computed(() => {
        this.#editorService.state();
        return this.#editorService.editor.isActive({ textAlign: "right" });
    });

    public onAlignCenter(): void {
        if (this.alignCenterSelected()) {
            this.#editorService.editor.chain().focus().unsetTextAlign().run();
        } else {
            this.#editorService.editor.chain().focus().setTextAlign("center").run();
        }
    }

    public onAlignJustify(): void {
        if (this.alignJustifySelected()) {
            this.#editorService.editor.chain().focus().unsetTextAlign().run();
        } else {
            this.#editorService.editor.chain().focus().setTextAlign("justify").run();
        }
    }

    public onAlignLeft(): void {
        if (this.alignLeftSelected()) {
            this.#editorService.editor.chain().focus().unsetTextAlign().run();
        } else {
            this.#editorService.editor.chain().focus().setTextAlign("left").run();
        }
    }

    public onAlignRight(): void {
        if (this.alignRightSelected()) {
            this.#editorService.editor.chain().focus().unsetTextAlign().run();
        } else {
            this.#editorService.editor.chain().focus().setTextAlign("right").run();
        }
    }
}
