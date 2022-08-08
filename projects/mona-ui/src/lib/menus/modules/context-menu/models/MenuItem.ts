import { TemplateRef } from "@angular/core";

export interface MenuItem {
    disabled?: boolean;
    divider?: boolean;
    menuClick?: () => void;
    subMenuItems?: MenuItem[];
    text?: string;
    textTemplate?: TemplateRef<void>;
    visible?: boolean;
}
