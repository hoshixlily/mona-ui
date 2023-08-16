import { Directive, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { CheckableOptions } from "../data/CheckableOptions";
import { TreeViewService } from "../services/tree-view.service";

@Directive({
    selector: "mona-tree-view[monaTreeViewCheckable]"
})
export class TreeViewCheckableDirective implements OnInit, OnChanges {
    @Input()
    public set checkedKeys(checkedKeys: Iterable<string>) {
        this.treeViewService.checkedKeys.clear();
        this.treeViewService.checkedKeys.addAll(checkedKeys);
    }

    @Output()
    public checkedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();

    @Input("monaTreeViewCheckable")
    public options?: CheckableOptions | "";

    public constructor(private readonly treeViewService: TreeViewService) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes["checkedKeys"] && !changes["checkedKeys"].isFirstChange()) {
            this.treeViewService.loadCheckedKeys(this.treeViewService.checkedKeys);
        }
    }

    public ngOnInit(): void {
        this.treeViewService.checkedKeysChange = this.checkedKeysChange;
        if (this.options) {
            this.treeViewService.setCheckableOptions(this.options);
        } else if (this.options === "") {
            this.treeViewService.setCheckableOptions({ enabled: true });
        }
        this.treeViewService.loadCheckedKeys(this.treeViewService.checkedKeys);
    }
}
