import { Directive, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { TreeViewComponent } from "../components/tree-view/tree-view.component";
import { TreeViewService } from "../services/tree-view.service";

@Directive({
    selector: "mona-tree-view[monaTreeViewExpandable]"
})
export class TreeViewExpandableDirective implements OnInit, OnChanges {
    @Input()
    public set expandedKeys(expandedKeys: Iterable<string>) {
        this.treeViewService.expandedKeys.clear();
        this.treeViewService.expandedKeys.addAll(expandedKeys);
    }

    @Output()
    public expandedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();

    public constructor(private readonly treeViewService: TreeViewService) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes["expandedKeys"] && !changes["expandedKeys"].isFirstChange()) {
            this.treeViewService.loadExpandedKeys(this.treeViewService.expandedKeys);
        }
    }

    public ngOnInit(): void {
        this.treeViewService.expandedKeysChange = this.expandedKeysChange;
        this.treeViewService.loadExpandedKeys(this.treeViewService.expandedKeys);
    }
}
