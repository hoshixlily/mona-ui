import { PipeTransform } from "@angular/core";
import * as i0 from "@angular/core";
export declare class SlicePipe implements PipeTransform {
    transform<T>(value: Iterable<T>, start: number, end: number): T[];
    static ɵfac: i0.ɵɵFactoryDeclaration<SlicePipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<SlicePipe, "monaSlice", true>;
}
