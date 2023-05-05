import { Pipe } from "@angular/core";
import { Enumerable } from "@mirei/ts-collections";
import { DateTime } from "luxon";
import * as i0 from "@angular/core";
export class DateIncludePipe {
    transform(value, dates) {
        const valueDateTime = DateTime.fromJSDate(value);
        return Enumerable.from(dates)
            .select(d => DateTime.fromJSDate(d))
            .any(d => d.hasSame(valueDateTime, "day") &&
            d.hasSame(valueDateTime, "month") &&
            d.hasSame(valueDateTime, "year"));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DateIncludePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: DateIncludePipe, isStandalone: true, name: "monaDateInclude" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DateIncludePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: "monaDateInclude",
                    standalone: true
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1pbmNsdWRlLnBpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvcGlwZXMvZGF0ZS1pbmNsdWRlLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDcEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ25ELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxPQUFPLENBQUM7O0FBTWpDLE1BQU0sT0FBTyxlQUFlO0lBQ2pCLFNBQVMsQ0FBQyxLQUFXLEVBQUUsS0FBcUI7UUFDL0MsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqRCxPQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2FBQ3hCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbkMsR0FBRyxDQUNBLENBQUMsQ0FBQyxFQUFFLENBQ0EsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDO1lBQy9CLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQztZQUNqQyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FDdkMsQ0FBQztJQUNWLENBQUM7OEdBWFEsZUFBZTs0R0FBZixlQUFlOzsyRkFBZixlQUFlO2tCQUozQixJQUFJO21CQUFDO29CQUNGLElBQUksRUFBRSxpQkFBaUI7b0JBQ3ZCLFVBQVUsRUFBRSxJQUFJO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgRW51bWVyYWJsZSB9IGZyb20gXCJAbWlyZWkvdHMtY29sbGVjdGlvbnNcIjtcbmltcG9ydCB7IERhdGVUaW1lIH0gZnJvbSBcImx1eG9uXCI7XG5cbkBQaXBlKHtcbiAgICBuYW1lOiBcIm1vbmFEYXRlSW5jbHVkZVwiLFxuICAgIHN0YW5kYWxvbmU6IHRydWVcbn0pXG5leHBvcnQgY2xhc3MgRGF0ZUluY2x1ZGVQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gICAgcHVibGljIHRyYW5zZm9ybSh2YWx1ZTogRGF0ZSwgZGF0ZXM6IEl0ZXJhYmxlPERhdGU+KTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHZhbHVlRGF0ZVRpbWUgPSBEYXRlVGltZS5mcm9tSlNEYXRlKHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIEVudW1lcmFibGUuZnJvbShkYXRlcylcbiAgICAgICAgICAgIC5zZWxlY3QoZCA9PiBEYXRlVGltZS5mcm9tSlNEYXRlKGQpKVxuICAgICAgICAgICAgLmFueShcbiAgICAgICAgICAgICAgICBkID0+XG4gICAgICAgICAgICAgICAgICAgIGQuaGFzU2FtZSh2YWx1ZURhdGVUaW1lLCBcImRheVwiKSAmJlxuICAgICAgICAgICAgICAgICAgICBkLmhhc1NhbWUodmFsdWVEYXRlVGltZSwgXCJtb250aFwiKSAmJlxuICAgICAgICAgICAgICAgICAgICBkLmhhc1NhbWUodmFsdWVEYXRlVGltZSwgXCJ5ZWFyXCIpXG4gICAgICAgICAgICApO1xuICAgIH1cbn1cbiJdfQ==