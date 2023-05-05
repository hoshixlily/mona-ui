import { OnChanges, SimpleChanges } from "@angular/core";
import { TreeViewComponent } from "../components/tree-view/tree-view.component";
import { TreeViewService } from "../services/tree-view.service";
import * as i0 from "@angular/core";
export declare class TreeViewDisableDirective implements OnChanges {
    private readonly treeView;
    private readonly treeViewService;
    set disabledKeys(disabledKeys: Iterable<string>);
    constructor(treeView: TreeViewComponent, treeViewService: TreeViewService);
    ngOnChanges(changes: SimpleChanges): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TreeViewDisableDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<TreeViewDisableDirective, "mona-tree-view[monaTreeViewDisable]", never, { "disabledKeys": { "alias": "disabledKeys"; "required": false; }; }, {}, never, never, false, never>;
}
