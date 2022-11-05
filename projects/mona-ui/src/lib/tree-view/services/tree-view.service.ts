import { Injectable } from "@angular/core";
import { CheckableOptions } from "../data/CheckableOptions";
import { Dictionary } from "@mirei/ts-collections";
import { Node } from "../data/Node";

@Injectable()
export class TreeViewService {
    public readonly defaultCheckableOptions: CheckableOptions = {
        checkChildren: true,
        checkMode: "multiple",
        checkParents: true,
        enabled: true
    };
    public checkableOptions?: CheckableOptions;
    public nodeDictionary: Dictionary<string, Node> = new Dictionary<string, Node>();
    public nodeList: Node[] = [];
    public viewNodeList: Node[] = [];

    public constructor() {}

    public setCheckableOptions(options: CheckableOptions): void {
        this.checkableOptions = { ...this.defaultCheckableOptions, ...options };
    }

    public uncheckAllNodes(): void {
        this.nodeList.forEach(node => node.check({ checked: false, checkChildren: true, checkParent: true }));
    }
}
