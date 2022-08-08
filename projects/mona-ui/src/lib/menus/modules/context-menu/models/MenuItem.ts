export interface MenuItem {
    disabled?: boolean;
    divider?: boolean;
    menuClick?: () => void;
    subMenuItems?: MenuItem[];
    text?: string;
    visible?: boolean;
}
