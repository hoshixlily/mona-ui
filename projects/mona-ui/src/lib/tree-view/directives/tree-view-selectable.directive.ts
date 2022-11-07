import { Directive, EventEmitter, Input, Output } from "@angular/core";
import { SelectableOptions } from "../data/SelectableOptions";
import { TreeViewComponent } from "../components/tree-view/tree-view.component";
import { TreeViewService } from "../services/tree-view.service";

@Directive({
    selector: "mona-tree-view[monaTreeViewSelectable]"
})
export class TreeViewSelectableDirective {
    private selectedKeysList: string[] = [];

    @Input()
    public set selectedKeys(selectedKeys: Iterable<string>) {
        this.selectedKeysList = [...selectedKeys];
    }

    @Output()
    public selectedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();

    @Input("monaTreeViewSelectable")
    public options?: SelectableOptions | "";

    public constructor(
        private readonly treeView: TreeViewComponent,
        private readonly treeViewService: TreeViewService
    ) {}

    public ngOnInit(): void {
        this.treeViewService.selectedKeysChange = this.selectedKeysChange;
        if (this.options) {
            this.treeViewService.setSelectableOptions(this.options);
        } else if (this.options === "") {
            this.treeViewService.setSelectableOptions({ enabled: true });
        }
        this.treeViewService.loadSelectedKeys(this.selectedKeysList);
    }
}
