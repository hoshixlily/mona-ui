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
        this.checked = node.state.checked();
        this.data = node.data;
        this.disabled = node.disabled;
        this.expanded = node.state.expanded();
        this.indeterminate = node.state.indeterminate();
        this.key = node.key;
        this.nodes = node.nodes.map(node => new NodeLookupItem(node));
        this.selected = node.state.selected();
        this.text = node.text;
    }
}
