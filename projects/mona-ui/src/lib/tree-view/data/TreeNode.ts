export interface TreeNodeOptions<T = any> {
    checked?: boolean;
    data?: T;
    expanded?: boolean;
    id?: string;
    nodes?: TreeNodeOptions<T>[];
    selected?: boolean;
    text?: string;
}

export class TreeNode<T = any> {
    public checked: boolean = false;
    public data?: T;
    public expanded: boolean = false;
    public nodes: TreeNode<T>[] = [];
    public selected: boolean = false;
    public text: string = "";
    public constructor(options: TreeNodeOptions<T>) {
        this.checked = options.checked ?? false;
        this.data = options.data;
        this.expanded = options.expanded || false;
        this.nodes = options.nodes?.map(node => new TreeNode(node)) ?? [];
        this.selected = options.selected ?? false;
        this.text = options.text ?? "";
    }
}
