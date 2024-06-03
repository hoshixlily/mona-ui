import { Injectable, signal } from "@angular/core";
import { any, ImmutableSet, List } from "@mirei/ts-collections";
import { Editor, Extension, Mark, Node } from "@tiptap/core";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import { Highlight } from "@tiptap/extension-highlight";
import { Link } from "@tiptap/extension-link";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import { EditorState } from "@tiptap/pm/state";
import { StarterKit } from "@tiptap/starter-kit";
import { ExtendedImage } from "../extensions/ExtendedImage";
import { FontSize } from "../extensions/FontSize";
import { Indent } from "../extensions/Indent";
import { EditorSettings } from "../models/EditorSettings";

type ExtensionTypes = Extension | Mark | Node;

@Injectable()
export class EditorService {
    readonly #defaultSettings: EditorSettings = {
        alignment: true,
        blockquote: true,
        bold: true,
        fontColor: true,
        fontFamily: true,
        fontHighlight: true,
        fontList: [],
        fontSize: true,
        headings: true,
        history: true,
        horizontalRule: true,
        image: true,
        indent: true,
        italic: true,
        link: true,
        list: true,
        strikethrough: true,
        subscript: true,
        superscript: true,
        table: true,
        taskList: true,
        underline: true
    };
    readonly #state = signal<EditorState>({} as EditorState);
    #editor!: Editor;
    public readonly fonts = signal(
        ImmutableSet.create([
            "Arial",
            "Comic Sans MS",
            "Courier New",
            "Georgia",
            "Impact",
            "Lucida Console",
            "Lucida Sans Unicode",
            "Palatino Linotype",
            "Tahoma",
            "Times New Roman",
            "Trebuchet MS",
            "Verdana"
        ])
    );
    public readonly state = this.#state.asReadonly();
    public readonly settings = signal<Partial<EditorSettings>>({});

    public destroy(): void {
        this.#editor.destroy();
    }

    public setupEditor(element: HTMLDivElement, settings: Partial<EditorSettings>): void {
        if (this.#editor) {
            this.#editor.destroy();
        }
        const editorSettings = { ...this.#defaultSettings, ...settings };
        if (editorSettings.fontList && any(editorSettings.fontList)) {
            this.fonts.set(ImmutableSet.create(editorSettings.fontList));
        }
        this.#editor = new Editor({
            element,
            extensions: this.getExtensionsFromSettings(editorSettings),
            content: ``,
            onCreate: ({ editor }) => {
                this.#state.set(editor.state);
                this.settings.set(editorSettings);
            },
            onTransaction: tx => this.#state.set(tx.editor.state)
        });
    }

    public get editor(): Editor {
        return this.#editor;
    }

    private getExtensionsFromSettings(settings: Partial<EditorSettings>): ExtensionTypes[] {
        const extensions: List<ExtensionTypes> = new List();
        extensions.add(TextStyle);

        const customizedStarterKit = this.getCustomizedStarterKitExtension(settings);
        extensions.add(customizedStarterKit);

        if (settings.alignment) {
            extensions.add(
                TextAlign.configure({
                    types: ["paragraph", "heading"]
                })
            );
        }
        if (settings.fontColor) {
            extensions.add(Color);
        }
        if (settings.fontFamily) {
            extensions.add(FontFamily);
        }
        if (settings.fontHighlight) {
            extensions.add(Highlight.configure({ multicolor: true }));
        }
        if (settings.fontSize) {
            extensions.add(FontSize);
        }
        if (settings.image) {
            extensions.add(ExtendedImage);
        }
        if (settings.indent) {
            extensions.add(Indent);
        }
        if (settings.link) {
            extensions.add(
                Link.configure({
                    openOnClick: "whenNotEditable",
                    autolink: true
                })
            );
        }
        if (settings.subscript) {
            extensions.add(Subscript);
        }
        if (settings.superscript) {
            extensions.add(Superscript);
        }
        if (settings.underline) {
            extensions.add(Underline);
        }
        if (settings.table) {
            extensions.add(
                Table.configure({
                    resizable: true
                })
            );
            extensions.add(TableHeader);
            extensions.add(TableRow);
            extensions.add(TableCell);
        }
        if (settings.taskList) {
            extensions.add(TaskList);
            extensions.add(
                TaskItem.configure({
                    nested: true
                })
            );
        }
        return extensions.toArray();
    }

    private getCustomizedStarterKitExtension(settings: Partial<EditorSettings>): Extension {
        let starterKit = StarterKit;

        if (!settings.bold) {
            starterKit = starterKit.configure({ bold: false });
        }
        if (!settings.italic) {
            starterKit = starterKit.configure({ italic: false });
        }
        if (!settings.strikethrough) {
            starterKit = starterKit.configure({ strike: false });
        }
        if (!settings.history) {
            starterKit = starterKit.configure({ history: false });
        }
        if (!settings.blockquote) {
            starterKit = starterKit.configure({ blockquote: false });
        }
        if (!settings.list) {
            starterKit = starterKit.configure({ bulletList: false, orderedList: false, listItem: false });
        }
        if (!settings.headings) {
            starterKit = starterKit.configure({ heading: false });
        }
        if (!settings.horizontalRule) {
            starterKit = starterKit.configure({ horizontalRule: false });
        }
        return starterKit;
    }
}
