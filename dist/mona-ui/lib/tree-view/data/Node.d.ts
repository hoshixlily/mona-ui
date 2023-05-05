import { NodeCheckOptions } from "./NodeCheckOptions";
import { NodeLookupItem } from "./NodeLookupItem";
export interface NodeOptions<T = any> {
    checked?: boolean;
    data?: T;
    disabled?: boolean;
    expanded?: boolean;
    indeterminate?: boolean;
    key: string;
    nodes?: NodeOptions<T>[];
    parent?: Node<T>;
    selected?: boolean;
    text?: string;
}
export declare class Node<T = any> {
    readonly uid: string;
    checked: boolean;
    data?: T;
    disabled: boolean;
    expanded: boolean;
    focused: boolean;
    indeterminate: boolean;
    key: string;
    nodes: Node<T>[];
    parent?: Node<T>;
    selected: boolean;
    text: string;
    constructor(options: NodeOptions<T>);
    anyParentCollapsed(): boolean;
    check(options: NodeCheckOptions): void;
    expand(expanded: boolean, expandChildren?: boolean): void;
    isDescendantOf(node: Node): boolean;
    getLookupItem(): NodeLookupItem<T>;
    setSelected(selected: boolean): void;
}
