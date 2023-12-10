import { Directive, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { SelectableOptions } from "../models/SelectableOptions";
import { TreeViewService } from "../services/tree-view.service";

@Directive({
    selector: "mona-tree-view[monaTreeViewSelectable]",
    standalone: true
})
export class TreeViewSelectableDirective implements OnInit, OnChanges {
    @Input("monaTreeViewSelectable")
    public options?: SelectableOptions | "";

    @Input()
    public set selectedKeys(selectedKeys: Iterable<string>) {
        this.treeViewService.selectedKeys.clear();
        this.treeViewService.selectedKeys.addAll(selectedKeys);
    }

    @Output()
    public selectedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();

    public constructor(private readonly treeViewService: TreeViewService) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes["selectedKeys"] && !changes["selectedKeys"].isFirstChange()) {
            this.treeViewService.loadSelectedKeys(this.treeViewService.selectedKeys);
        }
    }

    public ngOnInit(): void {
        this.treeViewService.selectedKeysChange = this.selectedKeysChange;
        if (this.options) {
            this.treeViewService.setSelectableOptions(this.options);
        } else if (this.options === "") {
            this.treeViewService.setSelectableOptions({ enabled: true });
        }
        this.treeViewService.loadSelectedKeys(this.treeViewService.selectedKeys);
    }
}
