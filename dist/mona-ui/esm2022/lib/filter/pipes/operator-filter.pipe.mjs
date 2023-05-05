import { Pipe } from "@angular/core";
import * as i0 from "@angular/core";
export class OperatorFilterPipe {
    transform(value, visibleOperators) {
        if (!visibleOperators || visibleOperators.length === 0) {
            return value;
        }
        return value
            .filter(item => visibleOperators.includes(item.value))
            .sort((a, b) => {
            return visibleOperators.indexOf(a.value) - visibleOperators.indexOf(b.value);
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: OperatorFilterPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: OperatorFilterPipe, name: "operatorFilter" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: OperatorFilterPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: "operatorFilter"
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3BlcmF0b3ItZmlsdGVyLnBpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvZmlsdGVyL3BpcGVzL29wZXJhdG9yLWZpbHRlci5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDOztBQU9wRCxNQUFNLE9BQU8sa0JBQWtCO0lBQ3BCLFNBQVMsQ0FBQyxLQUEyQixFQUFFLGdCQUFvQztRQUM5RSxJQUFJLENBQUMsZ0JBQWdCLElBQUksZ0JBQWdCLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNwRCxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUNELE9BQU8sS0FBSzthQUNQLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDckQsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ1gsT0FBTyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakYsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDOzhHQVZRLGtCQUFrQjs0R0FBbEIsa0JBQWtCOzsyRkFBbEIsa0JBQWtCO2tCQUg5QixJQUFJO21CQUFDO29CQUNGLElBQUksRUFBRSxnQkFBZ0I7aUJBQ3pCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBGaWx0ZXJPcGVyYXRvcnMgfSBmcm9tIFwiLi4vLi4vcXVlcnkvZmlsdGVyL0ZpbHRlckRlc2NyaXB0b3JcIjtcbmltcG9ydCB7IEZpbHRlck1lbnVEYXRhSXRlbSB9IGZyb20gXCIuLi9tb2RlbHMvRmlsdGVyTWVudURhdGFJdGVtXCI7XG5cbkBQaXBlKHtcbiAgICBuYW1lOiBcIm9wZXJhdG9yRmlsdGVyXCJcbn0pXG5leHBvcnQgY2xhc3MgT3BlcmF0b3JGaWx0ZXJQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gICAgcHVibGljIHRyYW5zZm9ybSh2YWx1ZTogRmlsdGVyTWVudURhdGFJdGVtW10sIHZpc2libGVPcGVyYXRvcnM/OiBGaWx0ZXJPcGVyYXRvcnNbXSk6IEZpbHRlck1lbnVEYXRhSXRlbVtdIHtcbiAgICAgICAgaWYgKCF2aXNpYmxlT3BlcmF0b3JzIHx8IHZpc2libGVPcGVyYXRvcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICAgICAgICAuZmlsdGVyKGl0ZW0gPT4gdmlzaWJsZU9wZXJhdG9ycy5pbmNsdWRlcyhpdGVtLnZhbHVlKSlcbiAgICAgICAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZpc2libGVPcGVyYXRvcnMuaW5kZXhPZihhLnZhbHVlKSAtIHZpc2libGVPcGVyYXRvcnMuaW5kZXhPZihiLnZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==