import { DialogAction } from "./DialogAction";

export interface DialogResult {
    action?: DialogAction;
    value?: string | number | null;
    viaClose?: boolean;
}
