import { PipeTransform } from "@angular/core";
import * as i0 from "@angular/core";
export declare class GridPagePipe implements PipeTransform {
    transform<T>(value: T[], skip: number, take: number): T[];
    static ɵfac: i0.ɵɵFactoryDeclaration<GridPagePipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<GridPagePipe, "gridPage", false>;
}
