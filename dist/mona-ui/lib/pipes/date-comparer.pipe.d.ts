import { PipeTransform } from "@angular/core";
import * as i0 from "@angular/core";
type DateComparisonOperator = "==" | "!=" | "<" | "<=" | ">" | ">=";
export declare class DateComparerPipe implements PipeTransform {
    transform(value: Date | null, other: Date | null, operator: DateComparisonOperator): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateComparerPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<DateComparerPipe, "monaDateComparer", true>;
}
export {};
