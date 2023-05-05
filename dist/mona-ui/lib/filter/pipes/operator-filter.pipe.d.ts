import { PipeTransform } from "@angular/core";
import { FilterOperators } from "../../query/filter/FilterDescriptor";
import { FilterMenuDataItem } from "../models/FilterMenuDataItem";
import * as i0 from "@angular/core";
export declare class OperatorFilterPipe implements PipeTransform {
    transform(value: FilterMenuDataItem[], visibleOperators?: FilterOperators[]): FilterMenuDataItem[];
    static ɵfac: i0.ɵɵFactoryDeclaration<OperatorFilterPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<OperatorFilterPipe, "operatorFilter", false>;
}
