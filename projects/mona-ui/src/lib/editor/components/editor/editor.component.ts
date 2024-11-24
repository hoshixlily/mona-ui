import {
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    inject,
    input,
    OnDestroy,
    OnInit,
    output,
    untracked,
    viewChild
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { JSONContent } from "@tiptap/core";
import { ContentChangeEvent } from "../../models/ContentChangeEvent";
import { EditorSettings } from "../../models/EditorSettings";
import { EditorService } from "../../services/editor.service";
import { EditorBasicTextStylesComponent } from "../editor-basic-text-styles/editor-basic-text-styles.component";
import { EditorBlockquoteComponent } from "../editor-blockquote/editor-blockquote.component";
import { EditorCodeBlockComponent } from "../editor-code-block/editor-code-block.component";
import { EditorFontColorComponent } from "../editor-font-color/editor-font-color.component";
import { EditorFontFamilyComponent } from "../editor-font-family/editor-font-family.component";
import { EditorFontHighlightComponent } from "../editor-font-highlight/editor-font-highlight.component";
import { EditorFontSizeComponent } from "../editor-font-size/editor-font-size.component";
import { EditorHeadingsComponent } from "../editor-headings/editor-headings.component";
import { EditorHistoryComponent } from "../editor-history/editor-history.component";
import { EditorHorizontalRuleComponent } from "../editor-horizontal-rule/editor-horizontal-rule.component";
import { EditorImageComponent } from "../editor-image/editor-image.component";
import { EditorIndentComponent } from "../editor-indent/editor-indent.component";
import { EditorLinkComponent } from "../editor-link/editor-link.component";
import { EditorListComponent } from "../editor-list/editor-list.component";
import { EditorTableComponent } from "../editor-table/editor-table.component";
import { EditorTaskListComponent } from "../editor-task-list/editor-task-list.component";
import { EditorTextAlignmentsComponent } from "../editor-text-alignments/editor-text-alignments.component";

@Component({
    selector: "mona-editor",
    imports: [
        FormsModule,
        EditorBasicTextStylesComponent,
        EditorHeadingsComponent,
        EditorTextAlignmentsComponent,
        EditorFontSizeComponent,
        EditorFontColorComponent,
        EditorFontHighlightComponent,
        EditorBlockquoteComponent,
        EditorLinkComponent,
        EditorListComponent,
        EditorIndentComponent,
        EditorHistoryComponent,
        EditorFontFamilyComponent,
        EditorHorizontalRuleComponent,
        EditorTaskListComponent,
        EditorImageComponent,
        EditorTableComponent,
        EditorCodeBlockComponent
    ],
    templateUrl: "./editor.component.html",
    styleUrl: "./editor.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [EditorService],
    host: {
        class: "mona-editor"
    }
})
export class EditorComponent implements OnDestroy, OnInit {
    protected readonly editorContainer = viewChild.required<ElementRef<HTMLDivElement>>("editorContainer");
    protected readonly editorService: EditorService = inject(EditorService);

    /**
     * Emits when the editor loses focus.
     */
    public readonly blur = output();

    /**
     * Emits when the editor is created for the first time and is ready to be used.
     */
    public readonly create = output();

    /**
     * Emits when the editor gains focus.
     */
    public readonly focus = output();

    /**
     * Emits when the selection of the editor changes.
     */
    public readonly selectionUpdate = output();

    /**
     * Emits when the content of the editor changes.
     */
    public readonly update = output<ContentChangeEvent>();

    /**
     * The initial content of the editor.
     * Accepted values are:
     * - A string representing the HTML content.
     * - A {@link JSONContent} representing the content.
     */
    public content = input<string | JSONContent>();

    /**
     * The settings of the editor.
     */
    public settings = input<Partial<EditorSettings>>({});

    public constructor() {
        effect(() => {
            const settings = this.settings();
            untracked(() => {
                this.editorService.setupEditor(this.editorContainer().nativeElement, settings);
            });
        });
        effect(() => {
            const content = this.content() ?? "";
            untracked(() => {
                this.loadEditorContent(content);
            });
        });
    }

    public ngOnDestroy(): void {
        this.editorService.destroy();
    }

    public ngOnInit(): void {
        this.setSubscriptions();
    }

    private loadEditorContent(content: string | JSONContent): void {
        if (typeof content === "string") {
            this.editorService.editor.commands.setContent(content);
        } else {
            this.editorService.editor.commands.setContent({
                type: "doc",
                content: [content]
            });
        }
    }

    private setSubscriptions(): void {
        this.editorService.blur$.subscribe(() => {
            this.blur.emit();
        });
        this.editorService.create$.subscribe(() => {
            this.create.emit();
        });
        this.editorService.focus$.subscribe(() => {
            this.focus.emit();
        });
        this.editorService.selectionUpdate$.subscribe(() => {
            this.selectionUpdate.emit();
        });
        this.editorService.update$.subscribe(() => {
            this.update.emit({
                html: this.html,
                json: this.json
            });
        });
    }

    /**
     * Returns the HTML content of the editor.
     * It can be used to save the content of the editor in a database and restore it later.
     */
    public get html(): string {
        return this.editorService.editor.getHTML();
    }

    /**
     * Returns the JSON content of the editor in the {@link JSONContent} format.
     * It can be used to save the content of the editor in a database and restore it later.
     */
    public get json(): JSONContent {
        return this.editorService.editor.getJSON();
    }
}
