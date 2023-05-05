import { Node } from "./Node";
export declare class NodeLookupItem<T = any> {
    readonly checked: boolean;
    readonly data?: T;
    readonly disabled: boolean;
    readonly expanded: boolean;
    readonly indeterminate: boolean;
    readonly key: string;
    readonly nodes: NodeLookupItem[];
    readonly selected: boolean;
    readonly text: string;
    constructor(node: Node);
}
