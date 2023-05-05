import { EventEmitter, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { TreeViewComponent } from "../components/tree-view/tree-view.component";
import { TreeViewService } from "../services/tree-view.service";
import * as i0 from "@angular/core";
export declare class TreeViewExpandableDirective implements OnInit, OnChanges {
    private readonly treeView;
    private readonly treeViewService;
    set expandedKeys(expandedKeys: Iterable<string>);
    expandedKeysChange: EventEmitter<string[]>;
    constructor(treeView: TreeViewComponent, treeViewService: TreeViewService);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TreeViewExpandableDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<TreeViewExpandableDirective, "mona-tree-view[monaTreeViewExpandable]", never, { "expandedKeys": { "alias": "expandedKeys"; "required": false; }; }, { "expandedKeysChange": "expandedKeysChange"; }, never, never, false, never>;
}
