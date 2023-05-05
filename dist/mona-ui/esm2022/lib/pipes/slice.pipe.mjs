import { Pipe } from "@angular/core";
import { Enumerable } from "@mirei/ts-collections";
import * as i0 from "@angular/core";
export class SlicePipe {
    transform(value, start, end) {
        return Enumerable.from(value)
            .skip(start)
            .take(end - start)
            .toArray();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SlicePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: SlicePipe, isStandalone: true, name: "monaSlice" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SlicePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: "monaSlice",
                    standalone: true
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpY2UucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9waXBlcy9zbGljZS5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBQ3BELE9BQU8sRUFBRSxVQUFVLEVBQWUsTUFBTSx1QkFBdUIsQ0FBQzs7QUFNaEUsTUFBTSxPQUFPLFNBQVM7SUFDbEIsU0FBUyxDQUFJLEtBQWtCLEVBQUUsS0FBYSxFQUFFLEdBQVc7UUFDdkQsT0FBTyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQzthQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDO2FBQ1gsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUM7YUFDakIsT0FBTyxFQUFFLENBQUM7SUFDbkIsQ0FBQzs4R0FOUSxTQUFTOzRHQUFULFNBQVM7OzJGQUFULFNBQVM7a0JBSnJCLElBQUk7bUJBQUM7b0JBQ0YsSUFBSSxFQUFFLFdBQVc7b0JBQ2pCLFVBQVUsRUFBRSxJQUFJO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgRW51bWVyYWJsZSwgSUVudW1lcmFibGUgfSBmcm9tIFwiQG1pcmVpL3RzLWNvbGxlY3Rpb25zXCI7XG5cbkBQaXBlKHtcbiAgICBuYW1lOiBcIm1vbmFTbGljZVwiLFxuICAgIHN0YW5kYWxvbmU6IHRydWVcbn0pXG5leHBvcnQgY2xhc3MgU2xpY2VQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gICAgdHJhbnNmb3JtPFQ+KHZhbHVlOiBJdGVyYWJsZTxUPiwgc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIpOiBUW10ge1xuICAgICAgICByZXR1cm4gRW51bWVyYWJsZS5mcm9tKHZhbHVlKVxuICAgICAgICAgICAgLnNraXAoc3RhcnQpXG4gICAgICAgICAgICAudGFrZShlbmQgLSBzdGFydClcbiAgICAgICAgICAgIC50b0FycmF5KCk7XG4gICAgfVxufVxuIl19