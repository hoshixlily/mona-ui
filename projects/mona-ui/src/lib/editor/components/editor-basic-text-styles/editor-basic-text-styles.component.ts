import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faBold, faItalic, faStrikethrough, faUnderline } from "@fortawesome/free-solid-svg-icons";
import { ButtonGroupComponent } from "../../../buttons/button-group/button-group.component";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { EditorService } from "../../services/editor.service";

@Component({
    selector: "mona-editor-basic-text-styles",
    standalone: true,
    imports: [ButtonDirective, ButtonGroupComponent, FaIconComponent],
    templateUrl: "./editor-basic-text-styles.component.html",
    styleUrl: "./editor-basic-text-styles.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorBasicTextStylesComponent {
    readonly #editorService: EditorService = inject(EditorService);
    protected readonly boldIcon = faBold;
    protected readonly boldSelected = computed(() => {
        this.#editorService.state();
        return this.#editorService.editor.isActive("bold");
    });
    protected readonly italicIcon = faItalic;
    protected readonly italicSelected = computed(() => {
        this.#editorService.state();
        return this.#editorService.editor.isActive("italic");
    });
    protected readonly strikeThroughIcon = faStrikethrough;
    protected readonly strikeThroughSelected = computed(() => {
        this.#editorService.state();
        return this.#editorService.editor.isActive("strike");
    });
    protected readonly underlineIcon = faUnderline;
    protected readonly underlineSelected = computed(() => {
        this.#editorService.state();
        return this.#editorService.editor.isActive("underline");
    });

    public onBoldToggle(): void {
        if (this.boldSelected()) {
            this.#editorService.editor.chain().focus().unsetBold().run();
        } else {
            this.#editorService.editor.chain().focus().setBold().run();
        }
    }

    public onItalicToggle(): void {
        if (this.italicSelected()) {
            this.#editorService.editor.chain().focus().unsetItalic().run();
        } else {
            this.#editorService.editor.chain().focus().setItalic().run();
        }
    }

    public onStrikeThroughToggle(): void {
        if (this.strikeThroughSelected()) {
            this.#editorService.editor.chain().focus().unsetStrike().run();
        } else {
            this.#editorService.editor.chain().focus().setStrike().run();
        }
    }

    public onUnderlineToggle(): void {
        if (this.underlineSelected()) {
            this.#editorService.editor.chain().focus().unsetUnderline().run();
        } else {
            this.#editorService.editor.chain().focus().setUnderline().run();
        }
    }
}
