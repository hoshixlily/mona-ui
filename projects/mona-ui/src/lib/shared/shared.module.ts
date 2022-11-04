import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TypeCastPipe } from "../pipes/type-cast.pipe";

/**
 * Internal use only. Do not export.
 */
@NgModule({
    declarations: [],
    imports: [CommonModule, TypeCastPipe],
    exports: []
})
export class SharedModule {}
