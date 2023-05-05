import { EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import { SelectableOptions } from "../models/SelectableOptions";
import { GridComponent } from "../components/grid/grid.component";
import { GridService } from "../services/grid.service";
import * as i0 from "@angular/core";
export declare class GridSelectableDirective implements OnInit, OnChanges, OnDestroy {
    #private;
    private readonly grid;
    private readonly gridService;
    set selectedKeys(selectedKeys: Iterable<unknown>);
    selectedKeysChange: EventEmitter<unknown[]>;
    set selectionKey(selectionKey: string);
    options?: SelectableOptions | "";
    constructor(grid: GridComponent, gridService: GridService);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
    private setSubscriptions;
    static ɵfac: i0.ɵɵFactoryDeclaration<GridSelectableDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<GridSelectableDirective, "mona-grid[monaGridSelectable]", never, { "selectedKeys": { "alias": "selectedKeys"; "required": false; }; "selectionKey": { "alias": "selectionKey"; "required": false; }; "options": { "alias": "monaGridSelectable"; "required": false; }; }, { "selectedKeysChange": "selectedKeysChange"; }, never, never, false, never>;
}
