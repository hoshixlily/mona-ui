import { Injectable, signal } from "@angular/core";
import { ImmutableSet } from "@mirei/ts-collections";
import { Editor } from "@tiptap/core";
import { Blockquote } from "@tiptap/extension-blockquote";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import { Highlight } from "@tiptap/extension-highlight";
import { Link } from "@tiptap/extension-link";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import { EditorState } from "@tiptap/pm/state";
import { StarterKit } from "@tiptap/starter-kit";
import { FontSize } from "../extensions/FontSize";
import { Indent } from "../extensions/Indent";
import { EditorSettings } from "../models/EditorSettings";

@Injectable()
export class EditorService {
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

    public destroy(): void {
        this.#editor.destroy();
    }

    public setupEditor(settings: EditorSettings): void {
        this.#editor = new Editor({
            element: settings.element,
            extensions: [
                StarterKit,
                Underline,
                Subscript,
                Superscript,
                Highlight.configure({ multicolor: true }),
                Blockquote,
                Indent,
                Link.configure({
                    openOnClick: "whenNotEditable",
                    autolink: true
                }),
                TextStyle,
                Color,
                FontSize,
                FontFamily,
                TextAlign.configure({
                    types: ["paragraph", "heading"]
                }),
                TaskItem.configure({
                    nested: true
                }),
                TaskList
            ],
            content: ``,
            onTransaction: tx => this.#state.set(tx.editor.state)
        });
    }

    public get editor(): Editor {
        return this.#editor;
    }
}
