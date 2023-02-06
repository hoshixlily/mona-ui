import { MenuItem } from "../../context-menu/models/MenuItem";

export interface MenuTextTemplateContext<T> {
    $implicit: string;
    items: MenuItem<T>[];
}
