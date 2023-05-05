import { ChangeDetectorRef, ElementRef, EventEmitter, OnDestroy, OnInit } from "@angular/core";
import { PopupService } from "../../../popup/services/popup.service";
import { FilterFieldType } from "../../../filter/models/FilterFieldType";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { GridService } from "../../services/grid.service";
import { ColumnFilterState } from "../../models/ColumnFilterState";
import { Column } from "../../models/Column";
import * as i0 from "@angular/core";
export declare class GridFilterMenuComponent implements OnInit, OnDestroy {
    #private;
    private readonly cdr;
    private readonly popupService;
    private readonly elementRef;
    private readonly gridService;
    private popupRef?;
    readonly filterIcon: IconDefinition;
    column: Column;
    apply: EventEmitter<ColumnFilterState>;
    type: FilterFieldType;
    constructor(cdr: ChangeDetectorRef, popupService: PopupService, elementRef: ElementRef, gridService: GridService);
    ngOnDestroy(): void;
    ngOnInit(): void;
    openPopup(): void;
    private setSubscriptions;
    static ɵfac: i0.ɵɵFactoryDeclaration<GridFilterMenuComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GridFilterMenuComponent, "mona-grid-filter-menu", never, { "column": { "alias": "column"; "required": false; }; "type": { "alias": "type"; "required": false; }; }, { "apply": "apply"; }, never, never, false, never>;
}
