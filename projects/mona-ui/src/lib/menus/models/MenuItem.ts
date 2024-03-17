import { TemplateRef } from "@angular/core";
import { ContextMenuItemIconTemplateContext } from "./ContextMenuItemIconTemplateContext";
import { ContextMenuItemTextTemplateContext } from "./ContextMenuItemTextTemplateContext";

export interface MenuItem<T = unknown> {
    data?: T;
    depth?: number;
    disabled?: boolean;
    divider?: boolean;
    iconClass?: string;
    iconTemplate?: TemplateRef<ContextMenuItemIconTemplateContext>;
    menuClick?: () => void;
    parent?: MenuItem | null;
    subMenuItems?: MenuItem[];
    text?: string;
    textTemplate?: TemplateRef<ContextMenuItemTextTemplateContext>;
    visible?: boolean;
}
