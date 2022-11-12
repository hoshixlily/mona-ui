import { Node } from "./Node";

export class NodeLookupItem<T = any> {
    public readonly checked: boolean;
    public readonly data?: T;
    public readonly disabled: boolean;
    public readonly expanded: boolean;
    public readonly indeterminate: boolean;
    public readonly key: string;
    public readonly nodes: NodeLookupItem[];
    public readonly selected: boolean;
    public readonly text: string;
    public constructor(node: Node) {
        this.checked = node.checked;
        this.data = node.data;
        this.disabled = node.disabled;
        this.expanded = node.expanded;
        this.indeterminate = node.indeterminate;
        this.key = node.key;
        this.nodes = node.nodes.map(node => new NodeLookupItem(node));
        this.selected = node.selected;
        this.text = node.text;
    }
}
