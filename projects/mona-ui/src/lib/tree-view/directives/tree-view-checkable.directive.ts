import { Directive, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { TreeViewComponent } from "../components/tree-view/tree-view.component";
import { CheckableOptions } from "../data/CheckableOptions";
import { TreeViewService } from "../services/tree-view.service";

@Directive({
    selector: "mona-tree-view[monaTreeViewCheckable]"
})
export class TreeViewCheckableDirective implements OnInit {
    private checkedKeysList: string[] = [];

    @Input()
    public set checkedKeys(checkedKeys: Iterable<string>) {
        this.checkedKeysList = [...checkedKeys];
    }

    @Output()
    public checkedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();

    @Input("monaTreeViewCheckable")
    public options?: CheckableOptions | "";

    public constructor(
        private readonly treeView: TreeViewComponent,
        private readonly treeViewService: TreeViewService
    ) {}

    public ngOnInit(): void {
        this.treeViewService.checkedKeysChange = this.checkedKeysChange;
        if (this.options) {
            this.treeViewService.setCheckableOptions(this.options);
        } else if (this.options === "") {
            this.treeViewService.setCheckableOptions({ enabled: true });
        }
        this.treeViewService.loadCheckedKeys(this.checkedKeysList);
    }
}
