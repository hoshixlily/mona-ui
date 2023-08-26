import { MenuItem } from "./MenuItem";

export interface MenuTextTemplateContext<T> {
    $implicit: string;
    items: MenuItem<T>[];
}
