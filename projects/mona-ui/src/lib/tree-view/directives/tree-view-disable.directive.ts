import { Directive, Input, OnChanges, SimpleChanges } from "@angular/core";
import { TreeViewComponent } from "../components/tree-view/tree-view.component";
import { TreeViewService } from "../services/tree-view.service";

@Directive({
    selector: "mona-tree-view[monaTreeViewDisable]"
})
export class TreeViewDisableDirective implements OnChanges {
    @Input()
    public set disabledKeys(disabledKeys: Iterable<string>) {
        this.treeViewService.disabledKeys.clear();
        this.treeViewService.disabledKeys.addAll(disabledKeys);
    }

    public constructor(
        private readonly treeView: TreeViewComponent,
        private readonly treeViewService: TreeViewService
    ) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes["disabledKeys"] && !changes["disabledKeys"].isFirstChange()) {
            this.treeViewService.loadDisabledKeys(this.treeViewService.disabledKeys);
        }
    }
}
