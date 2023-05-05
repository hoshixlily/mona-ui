import { PipeTransform } from "@angular/core";
import { FilterOperators } from "../../query/filter/FilterDescriptor";
import * as i0 from "@angular/core";
export declare class ValuelessOperatorPipe implements PipeTransform {
    transform(value: FilterOperators | undefined): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ValuelessOperatorPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<ValuelessOperatorPipe, "valuelessOperator", false>;
}
