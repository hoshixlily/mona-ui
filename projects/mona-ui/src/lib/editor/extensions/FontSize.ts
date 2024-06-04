import { Extension } from "@tiptap/core";

type FontSizeOptions = {
    getStyle: (fontSize: string) => string;
    types: string[];
};

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        fontSize: {
            setFontSize: (fontSize: string) => ReturnType;
            unsetFontSize: () => ReturnType;
        };
    }
}

export const FontSize = Extension.create<FontSizeOptions>({
    name: "fontSize",
    addOptions(): FontSizeOptions {
        return {
            types: ["textStyle"],
            getStyle: (fontSize: string) => {
                return `font-size: ${fontSize}`;
            }
        };
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: element => element.style.fontSize.replace(/['"]+/g, ""),
                        renderHTML: attributes => {
                            if (!attributes["fontSize"]) {
                                return {};
                            }

                            return {
                                style: this.options.getStyle(attributes["fontSize"])
                            };
                        }
                    }
                }
            }
        ];
    },
    addCommands() {
        return {
            setFontSize:
                fontSize =>
                ({ chain }) => {
                    return chain().setMark("textStyle", { fontSize }).run();
                },
            unsetFontSize:
                () =>
                ({ chain }) => {
                    return chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run();
                }
        };
    }
});
