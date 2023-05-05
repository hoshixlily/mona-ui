import { Pipe } from "@angular/core";
import * as i0 from "@angular/core";
export class ValuelessOperatorPipe {
    transform(value) {
        return (value === "isnull" ||
            value === "isnotnull" ||
            value === "isempty" ||
            value === "isnotempty" ||
            value === "isnullorempty" ||
            value === "isnotnullorempty");
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ValuelessOperatorPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: ValuelessOperatorPipe, name: "valuelessOperator" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ValuelessOperatorPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: "valuelessOperator"
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsdWVsZXNzLW9wZXJhdG9yLnBpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvZmlsdGVyL3BpcGVzL3ZhbHVlbGVzcy1vcGVyYXRvci5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDOztBQU1wRCxNQUFNLE9BQU8scUJBQXFCO0lBQ3ZCLFNBQVMsQ0FBQyxLQUFrQztRQUMvQyxPQUFPLENBQ0gsS0FBSyxLQUFLLFFBQVE7WUFDbEIsS0FBSyxLQUFLLFdBQVc7WUFDckIsS0FBSyxLQUFLLFNBQVM7WUFDbkIsS0FBSyxLQUFLLFlBQVk7WUFDdEIsS0FBSyxLQUFLLGVBQWU7WUFDekIsS0FBSyxLQUFLLGtCQUFrQixDQUMvQixDQUFDO0lBQ04sQ0FBQzs4R0FWUSxxQkFBcUI7NEdBQXJCLHFCQUFxQjs7MkZBQXJCLHFCQUFxQjtrQkFIakMsSUFBSTttQkFBQztvQkFDRixJQUFJLEVBQUUsbUJBQW1CO2lCQUM1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgRmlsdGVyT3BlcmF0b3JzIH0gZnJvbSBcIi4uLy4uL3F1ZXJ5L2ZpbHRlci9GaWx0ZXJEZXNjcmlwdG9yXCI7XG5cbkBQaXBlKHtcbiAgICBuYW1lOiBcInZhbHVlbGVzc09wZXJhdG9yXCJcbn0pXG5leHBvcnQgY2xhc3MgVmFsdWVsZXNzT3BlcmF0b3JQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gICAgcHVibGljIHRyYW5zZm9ybSh2YWx1ZTogRmlsdGVyT3BlcmF0b3JzIHwgdW5kZWZpbmVkKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB2YWx1ZSA9PT0gXCJpc251bGxcIiB8fFxuICAgICAgICAgICAgdmFsdWUgPT09IFwiaXNub3RudWxsXCIgfHxcbiAgICAgICAgICAgIHZhbHVlID09PSBcImlzZW1wdHlcIiB8fFxuICAgICAgICAgICAgdmFsdWUgPT09IFwiaXNub3RlbXB0eVwiIHx8XG4gICAgICAgICAgICB2YWx1ZSA9PT0gXCJpc251bGxvcmVtcHR5XCIgfHxcbiAgICAgICAgICAgIHZhbHVlID09PSBcImlzbm90bnVsbG9yZW1wdHlcIlxuICAgICAgICApO1xuICAgIH1cbn1cbiJdfQ==