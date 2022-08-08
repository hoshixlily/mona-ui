import { TemplateRef } from "@angular/core";

export interface MenuItem<T = unknown> {
    data?: T;
    disabled?: boolean;
    divider?: boolean;
    iconClass?: string;
    iconTemplate?: TemplateRef<void>;
    menuClick?: () => void;
    subMenuItems?: MenuItem[];
    text?: string;
    textTemplate?: TemplateRef<void>;
    visible?: boolean;
}
