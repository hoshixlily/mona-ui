import { OnInit } from "@angular/core";
import { Column } from "../../models/Column";
import { GridCellTemplateDirective } from "../../directives/grid-cell-template.directive";
import { FilterFieldType } from "../../../filter/models/FilterFieldType";
import * as i0 from "@angular/core";
export declare class GridColumnComponent implements OnInit {
    column: Column;
    set cellTemplate(value: GridCellTemplateDirective);
    set field(value: string);
    set filterType(value: FilterFieldType);
    set maxWidth(value: number);
    set minWidth(value: number);
    set title(value: string);
    set width(value: number);
    constructor();
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GridColumnComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GridColumnComponent, "mona-grid-column", never, { "field": { "alias": "field"; "required": false; }; "filterType": { "alias": "filterType"; "required": false; }; "maxWidth": { "alias": "maxWidth"; "required": false; }; "minWidth": { "alias": "minWidth"; "required": false; }; "title": { "alias": "title"; "required": false; }; "width": { "alias": "width"; "required": false; }; }, {}, ["cellTemplate"], never, false, never>;
}
