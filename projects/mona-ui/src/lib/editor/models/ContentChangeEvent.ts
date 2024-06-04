import { JSONContent } from "@tiptap/core";

export interface ContentChangeEvent {
    html: string;
    json: JSONContent;
}
