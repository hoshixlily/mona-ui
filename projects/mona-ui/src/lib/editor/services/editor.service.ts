import { Injectable, signal } from "@angular/core";
import { Editor } from "@tiptap/core";
import { Color } from "@tiptap/extension-color";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import { EditorState } from "@tiptap/pm/state";
import { StarterKit } from "@tiptap/starter-kit";
import { FontSize } from "../extensions/FontSize";
import { EditorSettings } from "../models/EditorSettings";

@Injectable()
export class EditorService {
    readonly #state = signal<EditorState>({} as EditorState);
    #editor!: Editor;
    public readonly state = this.#state.asReadonly();

    public setupEditor(settings: EditorSettings): void {
        this.#editor = new Editor({
            element: settings.element,
            extensions: [
                StarterKit,
                Underline,
                Subscript,
                Superscript,
                TextStyle,
                Color,
                FontSize,
                TextAlign.configure({
                    types: ["paragraph", "heading"]
                })
            ],
            content: ``,
            onTransaction: tx => this.#state.set(tx.editor.state)
        });
    }

    public get editor(): Editor {
        return this.#editor;
    }
}
