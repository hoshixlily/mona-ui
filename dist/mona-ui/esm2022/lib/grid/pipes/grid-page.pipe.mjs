import { Pipe } from "@angular/core";
import { Enumerable } from "@mirei/ts-collections";
import * as i0 from "@angular/core";
export class GridPagePipe {
    transform(value, skip, take) {
        if (!value) {
            return [];
        }
        if (value.length === 0) {
            return value;
        }
        if (skip >= value.length) {
            return [];
        }
        return Enumerable.from(value).skip(skip).take(take).toArray();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridPagePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: GridPagePipe, name: "gridPage" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridPagePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: "gridPage"
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1wYWdlLnBpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvZ3JpZC9waXBlcy9ncmlkLXBhZ2UucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUNwRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7O0FBTW5ELE1BQU0sT0FBTyxZQUFZO0lBQ2QsU0FBUyxDQUFJLEtBQVUsRUFBRSxJQUFZLEVBQUUsSUFBWTtRQUN0RCxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1IsT0FBTyxFQUFFLENBQUM7U0FDYjtRQUNELElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDcEIsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFDRCxJQUFJLElBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ3RCLE9BQU8sRUFBRSxDQUFDO1NBQ2I7UUFDRCxPQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNsRSxDQUFDOzhHQVpRLFlBQVk7NEdBQVosWUFBWTs7MkZBQVosWUFBWTtrQkFIeEIsSUFBSTttQkFBQztvQkFDRixJQUFJLEVBQUUsVUFBVTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEVudW1lcmFibGUgfSBmcm9tIFwiQG1pcmVpL3RzLWNvbGxlY3Rpb25zXCI7XG5pbXBvcnQgeyBSb3cgfSBmcm9tIFwiLi4vbW9kZWxzL1Jvd1wiO1xuXG5AUGlwZSh7XG4gICAgbmFtZTogXCJncmlkUGFnZVwiXG59KVxuZXhwb3J0IGNsYXNzIEdyaWRQYWdlUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICAgIHB1YmxpYyB0cmFuc2Zvcm08VD4odmFsdWU6IFRbXSwgc2tpcDogbnVtYmVyLCB0YWtlOiBudW1iZXIpOiBUW10ge1xuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChza2lwID49IHZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBFbnVtZXJhYmxlLmZyb20odmFsdWUpLnNraXAoc2tpcCkudGFrZSh0YWtlKS50b0FycmF5KCk7XG4gICAgfVxufVxuIl19