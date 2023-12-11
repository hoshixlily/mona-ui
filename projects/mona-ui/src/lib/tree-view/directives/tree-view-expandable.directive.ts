import { Directive, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { ExpandableOptions } from "../models/ExpandableOptions";
import { TreeViewService } from "../services/tree-view.service";

@Directive({
    selector: "mona-tree-view[monaTreeViewExpandable]",
    standalone: true
})
export class TreeViewExpandableDirective implements OnInit, OnChanges {
    @Input()
    public set expandedKeys(expandedKeys: Iterable<string>) {
        this.treeViewService.expandedKeys.clear();
        this.treeViewService.expandedKeys.addAll(expandedKeys);
    }

    @Output()
    public expandedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();

    @Input("monaTreeViewExpandable")
    public options?: ExpandableOptions | "";

    public constructor(private readonly treeViewService: TreeViewService) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes["expandedKeys"] && !changes["expandedKeys"].isFirstChange()) {
            this.treeViewService.loadExpandedKeys(this.treeViewService.expandedKeys);
        }
    }

    public ngOnInit(): void {
        this.treeViewService.expandedKeysChange = this.expandedKeysChange;
        if (this.options) {
            this.treeViewService.setExpandableOptions(this.options);
        } else if (this.options === "") {
            this.treeViewService.setExpandableOptions({ enabled: true });
        }
        this.treeViewService.loadExpandedKeys(this.treeViewService.expandedKeys);
    }
}
