import { Directive, EventEmitter, Input, Output } from "@angular/core";
import { TreeViewComponent } from "../components/tree-view/tree-view.component";
import { TreeViewService } from "../services/tree-view.service";

@Directive({
    selector: "mona-tree-view[monaTreeViewExpandable]"
})
export class TreeViewExpandableDirective {
    private expandedKeysList: string[] = [];

    @Input()
    public set expandedKeys(expandedKeys: Iterable<string>) {
        this.expandedKeysList = [...expandedKeys];
    }

    @Output()
    public expandedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();

    public constructor(
        private readonly treeView: TreeViewComponent,
        private readonly treeViewService: TreeViewService
    ) {}

    public ngOnInit(): void {
        this.treeViewService.expandedKeysChange = this.expandedKeysChange;
        this.treeViewService.loadExpandedKeys(this.expandedKeysList);
    }
}
