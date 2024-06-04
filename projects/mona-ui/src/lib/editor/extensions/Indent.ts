/**
 * Taken from https://github.com/ueberdosis/tiptap/issues/1036#issuecomment-1000983233
 */

import { CommandProps, Extension, Extensions, isList, KeyboardShortcutCommand } from "@tiptap/core";
import { TextSelection, Transaction } from "prosemirror-state";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        indent: {
            indent: () => ReturnType;
            outdent: () => ReturnType;
        };
    }
}

type IndentOptions = {
    defaultIndentLevel: number;
    htmlAttributes: Record<string, string | number>;
    indentRange: number;
    maxIndentLevel: number;
    minIndentLevel: number;
    names: string[];
};
type IndentType = "indent" | "outdent";

export const Indent = Extension.create<IndentOptions, never>({
    name: "indent",
    addOptions() {
        return {
            defaultIndentLevel: 0,
            htmlAttributes: {},
            indentRange: 24,
            maxIndentLevel: 24 * 10,
            minIndentLevel: 0,
            names: ["heading", "paragraph", "listItem"]
        };
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.names,
                attributes: {
                    indent: {
                        default: this.options.defaultIndentLevel,
                        renderHTML: attributes => ({
                            style: `margin-left: ${attributes["indent"]}px!important`
                        }),
                        parseHTML: element => parseInt(element.style.marginLeft, 10) || this.options.defaultIndentLevel
                    }
                }
            }
        ];
    },
    addCommands(this) {
        return {
            indent:
                () =>
                ({ tr, state, dispatch, editor }: CommandProps) => {
                    const { selection } = state;
                    tr = tr.setSelection(selection);
                    tr = updateIndentLevel(tr, this.options, editor.extensionManager.extensions, "indent");
                    if (tr.docChanged && dispatch) {
                        dispatch(tr);
                        return true;
                    }
                    return false;
                },
            outdent:
                () =>
                ({ tr, state, dispatch, editor }: CommandProps) => {
                    const { selection } = state;
                    tr = tr.setSelection(selection);
                    tr = updateIndentLevel(tr, this.options, editor.extensionManager.extensions, "outdent");
                    if (tr.docChanged && dispatch) {
                        dispatch(tr);
                        return true;
                    }
                    return false;
                }
        };
    },
    addKeyboardShortcuts() {
        return {
            Tab: getIndent(),
            "Shift-Tab": getOutdent(false),
            Backspace: getOutdent(true),
            "Mod-]": getIndent(),
            "Mod-[": getOutdent(false)
        };
    },
    onUpdate() {
        const { editor } = this;
        if (editor.isActive("listItem")) {
            const node = editor.state.selection.$head.node();
            if (node.attrs["indent"]) {
                editor.commands.updateAttributes(node.type.name, { indent: 2 });
            }
        }
    }
});

const clamp = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
};

const setNodeIndentMarkup = (tr: Transaction, pos: number, delta: number, min: number, max: number): Transaction => {
    if (!tr.doc) {
        return tr;
    }
    const node = tr.doc.nodeAt(pos);
    if (!node) {
        return tr;
    }
    const indent = clamp((node.attrs["indent"] || 0) + delta, min, max);
    if (indent === node.attrs["indent"]) {
        return tr;
    }
    const nodeAttributes = { ...node.attrs, indent };
    return tr.setNodeMarkup(pos, node.type, nodeAttributes, node.marks);
};

const updateIndentLevel = (
    tr: Transaction,
    options: IndentOptions,
    extensions: Extensions,
    type: IndentType
): Transaction => {
    const { doc, selection } = tr;
    if (!doc || !selection) {
        return tr;
    }
    if (!(selection instanceof TextSelection)) {
        return tr;
    }
    const { from, to } = selection;
    doc.nodesBetween(from, to, (node, pos) => {
        if (options.names.includes(node.type.name)) {
            tr = setNodeIndentMarkup(
                tr,
                pos,
                options.indentRange * (type === "indent" ? 1 : -1),
                options.minIndentLevel,
                options.maxIndentLevel
            );
            return false;
        }
        return !isList(node.type.name, extensions);
    });
    return tr;
};

const getIndent: () => KeyboardShortcutCommand =
    () =>
    ({ editor }) => {
        if (editor.can().sinkListItem("listItem")) {
            return editor.chain().focus().sinkListItem("listItem").run();
        }
        return editor.chain().focus().indent().run();
    };

const getOutdent: (outdentOnlyAtHead: boolean) => KeyboardShortcutCommand =
    outdentOnlyAtHead =>
    ({ editor }) => {
        if (outdentOnlyAtHead && editor.state.selection.$head.parentOffset > 0) {
            return false;
        }
        if (
            (!outdentOnlyAtHead || editor.state.selection.$head.parentOffset > 0) &&
            editor.can().liftListItem("listItem")
        ) {
            return editor.chain().focus().liftListItem("listItem").run();
        }
        return editor.chain().focus().outdent().run();
    };
