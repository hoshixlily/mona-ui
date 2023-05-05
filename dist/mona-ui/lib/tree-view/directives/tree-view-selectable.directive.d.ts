import { EventEmitter, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { SelectableOptions } from "../data/SelectableOptions";
import { TreeViewComponent } from "../components/tree-view/tree-view.component";
import { TreeViewService } from "../services/tree-view.service";
import * as i0 from "@angular/core";
export declare class TreeViewSelectableDirective implements OnInit, OnChanges {
    private readonly treeView;
    private readonly treeViewService;
    set selectedKeys(selectedKeys: Iterable<string>);
    selectedKeysChange: EventEmitter<string[]>;
    options?: SelectableOptions | "";
    constructor(treeView: TreeViewComponent, treeViewService: TreeViewService);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TreeViewSelectableDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<TreeViewSelectableDirective, "mona-tree-view[monaTreeViewSelectable]", never, { "selectedKeys": { "alias": "selectedKeys"; "required": false; }; "options": { "alias": "monaTreeViewSelectable"; "required": false; }; }, { "selectedKeysChange": "selectedKeysChange"; }, never, never, false, never>;
}
