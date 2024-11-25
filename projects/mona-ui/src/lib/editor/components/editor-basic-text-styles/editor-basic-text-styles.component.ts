import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { ButtonGroupComponent } from "../../../buttons/button-group/button-group.component";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { EditorService } from "../../services/editor.service";

@Component({
    selector: "mona-editor-basic-text-styles",
    imports: [ButtonDirective, ButtonGroupComponent],
    templateUrl: "./editor-basic-text-styles.component.html",
    styleUrl: "./editor-basic-text-styles.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorBasicTextStylesComponent {
    protected readonly anyToolVisible = computed(() => {
        return (
            this.boldVisible() ||
            this.italicVisible() ||
            this.underlineVisible() ||
            this.strikeThroughVisible() ||
            this.subscriptVisible() ||
            this.superscriptVisible()
        );
    });
    protected readonly boldSelected = computed(() => {
        this.editorService.state();
        return this.editorService.editor.isActive("bold");
    });
    protected readonly boldVisible = computed(() => {
        return this.editorService.settings().bold;
    });
    protected readonly editorService: EditorService = inject(EditorService);
    protected readonly italicSelected = computed(() => {
        this.editorService.state();
        return this.editorService.editor.isActive("italic");
    });
    protected readonly italicVisible = computed(() => {
        return this.editorService.settings().italic;
    });
    protected readonly strikeThroughSelected = computed(() => {
        this.editorService.state();
        return this.editorService.editor.isActive("strike");
    });
    protected readonly strikeThroughVisible = computed(() => {
        return this.editorService.settings().strikethrough;
    });
    protected readonly subscriptSelected = computed(() => {
        this.editorService.state();
        return this.editorService.editor.isActive("subscript");
    });
    protected readonly subscriptVisible = computed(() => {
        return this.editorService.settings().subscript;
    });
    protected readonly superscriptSelected = computed(() => {
        this.editorService.state();
        return this.editorService.editor.isActive("superscript");
    });
    protected readonly superscriptVisible = computed(() => {
        return this.editorService.settings().superscript;
    });
    protected readonly underlineSelected = computed(() => {
        this.editorService.state();
        return this.editorService.editor.isActive("underline");
    });
    protected readonly underlineVisible = computed(() => {
        return this.editorService.settings().underline;
    });

    public onBoldToggle(): void {
        if (this.boldSelected()) {
            this.editorService.editor.chain().focus().unsetBold().run();
        } else {
            this.editorService.editor.chain().focus().setBold().run();
        }
    }

    public onItalicToggle(): void {
        if (this.italicSelected()) {
            this.editorService.editor.chain().focus().unsetItalic().run();
        } else {
            this.editorService.editor.chain().focus().setItalic().run();
        }
    }

    public onStrikeThroughToggle(): void {
        if (this.strikeThroughSelected()) {
            this.editorService.editor.chain().focus().unsetStrike().run();
        } else {
            this.editorService.editor.chain().focus().setStrike().run();
        }
    }

    public onSubscriptToggle(): void {
        if (this.subscriptSelected()) {
            this.editorService.editor.chain().focus().unsetSubscript().run();
        } else {
            this.editorService.editor.chain().focus().setSubscript().run();
        }
    }

    public onSuperscriptToggle(): void {
        if (this.superscriptSelected()) {
            this.editorService.editor.chain().focus().unsetSuperscript().run();
        } else {
            this.editorService.editor.chain().focus().setSuperscript().run();
        }
    }

    public onUnderlineToggle(): void {
        if (this.underlineSelected()) {
            this.editorService.editor.chain().focus().unsetUnderline().run();
        } else {
            this.editorService.editor.chain().focus().setUnderline().run();
        }
    }
}
