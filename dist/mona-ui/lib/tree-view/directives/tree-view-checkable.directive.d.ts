import { EventEmitter, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { TreeViewComponent } from "../components/tree-view/tree-view.component";
import { CheckableOptions } from "../data/CheckableOptions";
import { TreeViewService } from "../services/tree-view.service";
import * as i0 from "@angular/core";
export declare class TreeViewCheckableDirective implements OnInit, OnChanges {
    private readonly treeView;
    private readonly treeViewService;
    set checkedKeys(checkedKeys: Iterable<string>);
    checkedKeysChange: EventEmitter<string[]>;
    options?: CheckableOptions | "";
    constructor(treeView: TreeViewComponent, treeViewService: TreeViewService);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TreeViewCheckableDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<TreeViewCheckableDirective, "mona-tree-view[monaTreeViewCheckable]", never, { "checkedKeys": { "alias": "checkedKeys"; "required": false; }; "options": { "alias": "monaTreeViewCheckable"; "required": false; }; }, { "checkedKeysChange": "checkedKeysChange"; }, never, never, false, never>;
}
