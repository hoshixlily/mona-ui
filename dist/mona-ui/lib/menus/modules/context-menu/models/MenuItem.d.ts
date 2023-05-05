import { TemplateRef } from "@angular/core";
import { ContextMenuItemTextTemplateContext } from "./ContextMenuItemTextTemplateContext";
import { ContextMenuItemIconTemplateContext } from "./ContextMenuItemIconTemplateContext";
export interface MenuItem<T = unknown> {
    data?: T;
    depth?: number;
    disabled?: boolean;
    divider?: boolean;
    iconClass?: string;
    iconTemplate?: TemplateRef<ContextMenuItemIconTemplateContext>;
    menuClick?: () => void;
    parent: MenuItem | null;
    subMenuItems?: MenuItem[];
    text?: string;
    textTemplate?: TemplateRef<ContextMenuItemTextTemplateContext>;
    visible?: boolean;
}
