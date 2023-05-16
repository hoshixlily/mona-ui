import { DialogAction } from "./DialogAction";
import { DialogType } from "./DialogType";
import { TemplateRef } from "@angular/core";

export interface DialogSettings {
    actions?: DialogAction[];

    /**
     * Only used when type is 'input'
     */
    height?: number;
    inputType?: "string" | "number";
    modal?: boolean;
    text: string;
    title?: string | TemplateRef<any>;
    type?: DialogType;

    /**
     * Only used when type is 'input'
     */
    value?: string | number;
    width?: number;
}
