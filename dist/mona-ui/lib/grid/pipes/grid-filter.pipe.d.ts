import { PipeTransform } from "@angular/core";
import { Dictionary } from "@mirei/ts-collections";
import { ColumnFilterState } from "../models/ColumnFilterState";
import { ColumnSortState } from "../models/ColumnSortState";
import { Row } from "../models/Row";
import * as i0 from "@angular/core";
export declare class GridFilterPipe implements PipeTransform {
    constructor();
    transform(value: Row[], filterStateDict: Dictionary<string, ColumnFilterState>, sortStateDict: Dictionary<string, ColumnSortState>): Row[];
    static ɵfac: i0.ɵɵFactoryDeclaration<GridFilterPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<GridFilterPipe, "gridFilter", false>;
}
