import { MenuItem } from "./MenuItem";

export interface ContextMenuItem<T = unknown> extends MenuItem<T> {
    focused?: boolean;
}
