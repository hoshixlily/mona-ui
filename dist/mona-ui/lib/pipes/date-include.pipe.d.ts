import { PipeTransform } from "@angular/core";
import * as i0 from "@angular/core";
export declare class DateIncludePipe implements PipeTransform {
    transform(value: Date, dates: Iterable<Date>): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateIncludePipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<DateIncludePipe, "monaDateInclude", true>;
}
