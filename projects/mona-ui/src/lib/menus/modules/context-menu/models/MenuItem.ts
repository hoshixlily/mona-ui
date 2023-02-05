import { TemplateRef } from "@angular/core";

export interface MenuItem<T = unknown> {
    data?: T;
    depth?: number;
    disabled?: boolean;
    divider?: boolean;
    iconClass?: string;
    iconTemplate?: TemplateRef<void>;
    menuClick?: () => void;
    parent: MenuItem | null;
    subMenuItems?: MenuItem[];
    text?: string;
    textTemplate?: TemplateRef<void>;
    visible?: boolean;
}
