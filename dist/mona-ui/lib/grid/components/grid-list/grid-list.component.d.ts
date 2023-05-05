import { AfterViewInit, ElementRef, OnDestroy, OnInit } from "@angular/core";
import { GridService } from "../../services/grid.service";
import { Column } from "../../models/Column";
import { Row } from "../../models/Row";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { GridGroup } from "../../models/GridGroup";
import * as i0 from "@angular/core";
export declare class GridListComponent implements OnInit, AfterViewInit, OnDestroy {
    #private;
    readonly gridService: GridService;
    private readonly elementRef;
    readonly collapseIcon: IconDefinition;
    readonly expandIcon: IconDefinition;
    columns: Column[];
    data: Row[];
    constructor(gridService: GridService, elementRef: ElementRef<HTMLDivElement>);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
    onGridRowClick(event: MouseEvent, row: Row): void;
    onGroupExpandChange(group: GridGroup): void;
    private setSubscriptions;
    private synchronizeHorizontalScroll;
    static ɵfac: i0.ɵɵFactoryDeclaration<GridListComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GridListComponent, "mona-grid-list", never, { "columns": { "alias": "columns"; "required": false; }; "data": { "alias": "data"; "required": false; }; }, {}, never, never, false, never>;
}
