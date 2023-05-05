import { PipeTransform } from "@angular/core";
import { Column } from "../models/Column";
import { Row } from "../models/Row";
import { GridGroup } from "../models/GridGroup";
import { GridService } from "../services/grid.service";
import * as i0 from "@angular/core";
export declare class GridGroupPipe implements PipeTransform {
    private readonly gridService;
    constructor(gridService: GridService);
    transform(value: Row[], column: Column, page: number): Array<GridGroup>;
    static ɵfac: i0.ɵɵFactoryDeclaration<GridGroupPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<GridGroupPipe, "gridGroup", false>;
}
