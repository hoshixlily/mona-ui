import { AfterContentInit, Directive, EventEmitter, Input, Output } from "@angular/core";
import { TreeViewComponent } from "../components/tree-view/tree-view.component";
import { CheckableOptions } from "../data/CheckableOptions";
import { TreeViewService } from "../services/tree-view.service";

@Directive({
    selector: "mona-tree-view[monaTreeViewCheckable]"
})
export class TreeViewCheckableDirective implements AfterContentInit {
    @Input()
    public set checkedKeys(checkedKeys: Iterable<string>) {}

    @Output()
    public checkedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();

    @Input("monaTreeViewCheckable")
    public options?: CheckableOptions | "";

    public constructor(
        private readonly treeView: TreeViewComponent,
        private readonly treeViewService: TreeViewService
    ) {}

    public ngAfterContentInit(): void {
        if (this.options) {
            this.treeViewService.setCheckableOptions(this.options);
        } else if (this.options === "") {
            this.treeViewService.setCheckableOptions({ enabled: true });
        }
    }
}
