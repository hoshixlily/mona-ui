import {
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    signal,
    viewChild
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faBold, faItalic, faStrikethrough, faUnderline, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Editor } from "@tiptap/core";
import { Underline } from "@tiptap/extension-underline";
import { EditorState } from "@tiptap/pm/state";
import { StarterKit } from "@tiptap/starter-kit";
import { ButtonGroupComponent } from "../../../buttons/button-group/button-group.component";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { DropDownItemTemplateDirective } from "../../../dropdowns/directives/drop-down-item-template.directive";
import { DropDownListComponent } from "../../../dropdowns/drop-down-list/components/drop-down-list/drop-down-list.component";
import { FormatDropdownListDataItem, FormatType } from "../../models/FormatDropdownListDataItem";

@Component({
    selector: "mona-editor",
    standalone: true,
    imports: [
        ButtonDirective,
        ButtonGroupComponent,
        FaIconComponent,
        DropDownListComponent,
        DropDownItemTemplateDirective,
        FormsModule
    ],
    templateUrl: "./editor.component.html",
    styleUrl: "./editor.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: "mona-editor"
    }
})
export class EditorComponent {
    readonly #state = signal<EditorState>({} as EditorState);
    #editor!: Editor;
    protected readonly FormatType = FormatType;
    protected readonly boldIcon: IconDefinition = faBold;
    protected readonly boldSelected = computed(() => {
        const state = this.#state();
        const selectionLength = Math.abs(state.selection.$from.pos - state.selection.$to.pos);
        if (selectionLength > 0) {
            return state.doc.rangeHasMark(
                state.selection.$from.pos,
                state.selection.$to.pos,
                state.schema.marks["bold"]
            );
        }
        return state.schema.marks["bold"].isInSet(state.storedMarks || state.selection.$from.marks()) != null;
    });
    protected readonly editorContainer = viewChild.required<ElementRef<HTMLDivElement>>("editorContainer");
    protected readonly formatDropdownListData = [
        { text: "Paragraph", value: FormatType.Paragraph },
        { text: "Heading 1", value: FormatType.Heading1 },
        { text: "Heading 2", value: FormatType.Heading2 },
        { text: "Heading 3", value: FormatType.Heading3 },
        { text: "Heading 4", value: FormatType.Heading4 },
        { text: "Heading 5", value: FormatType.Heading5 },
        { text: "Heading 6", value: FormatType.Heading6 }
    ];
    protected readonly italicIcon: IconDefinition = faItalic;
    protected readonly italicSelected = computed(() => {
        const state = this.#state();
        const selectionLength = Math.abs(state.selection.$from.pos - state.selection.$to.pos);
        if (selectionLength > 0) {
            return state.doc.rangeHasMark(
                state.selection.$from.pos,
                state.selection.$to.pos,
                state.schema.marks["italic"]
            );
        }
        return state.schema.marks["italic"].isInSet(state.storedMarks || state.selection.$from.marks()) != null;
    });
    protected readonly selectedFormatDropdownItem = computed(() => {
        const state = this.#state();
        const node = state.selection.$from.node();
        if (node) {
            if (node.type.name === "heading") {
                return this.formatDropdownListData.find(item => item.value === node.attrs["level"]);
            }
        }
        return this.formatDropdownListData.find(item => item.value === FormatType.Paragraph);
    });
    protected readonly strikeThroughIcon: IconDefinition = faStrikethrough;
    protected readonly strikeThroughSelected = computed(() => {
        const state = this.#state();
        const selectionLength = Math.abs(state.selection.$from.pos - state.selection.$to.pos);
        if (selectionLength > 0) {
            return state.doc.rangeHasMark(
                state.selection.$from.pos,
                state.selection.$to.pos,
                state.schema.marks["strike"]
            );
        }
        return state.schema.marks["strike"].isInSet(state.storedMarks || state.selection.$from.marks()) != null;
    });
    protected readonly underlineIcon: IconDefinition = faUnderline;
    protected readonly underlineSelected = computed(() => {
        const state = this.#state();
        const selectionLength = Math.abs(state.selection.$from.pos - state.selection.$to.pos);
        if (selectionLength > 0) {
            return state.doc.rangeHasMark(
                state.selection.$from.pos,
                state.selection.$to.pos,
                state.schema.marks["underline"]
            );
        }
        return state.schema.marks["underline"].isInSet(state.storedMarks || state.selection.$from.marks()) != null;
    });

    public constructor() {
        afterNextRender(() => {
            this.#editor = new Editor({
                element: this.editorContainer().nativeElement,
                extensions: [StarterKit, Underline],
                content: `
                    <h2>test</h2>
                    <p>test</p>
                `,
                onTransaction: tx => this.#state.set(tx.editor.state)
            });
        });
    }

    public onBoldToggle(): void {
        if (this.boldSelected()) {
            this.#editor.chain().focus().unsetBold().run();
        } else {
            this.#editor.chain().focus().setBold().run();
        }
    }

    public onFormatChange(formatItem: FormatDropdownListDataItem): void {
        if (formatItem.value === FormatType.Paragraph) {
            this.#editor.chain().focus().setParagraph().run();
        } else {
            this.#editor.chain().focus().setHeading({ level: formatItem.value }).run();
        }
    }

    public onItalicToggle(): void {
        if (this.italicSelected()) {
            this.#editor.chain().focus().unsetItalic().run();
        } else {
            this.#editor.chain().focus().setItalic().run();
        }
    }

    public onStrikeThroughToggle(): void {
        if (this.strikeThroughSelected()) {
            this.#editor.chain().focus().unsetStrike().run();
        } else {
            this.#editor.chain().focus().setStrike().run();
        }
    }

    public onUnderlineToggle(): void {
        if (this.underlineSelected()) {
            this.#editor.chain().focus().unsetUnderline().run();
        } else {
            this.#editor.chain().focus().setUnderline().run();
        }
    }
}
