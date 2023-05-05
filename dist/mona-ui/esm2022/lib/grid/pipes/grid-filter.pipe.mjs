import { Pipe } from "@angular/core";
import { Query } from "../../query/core/Query";
import * as i0 from "@angular/core";
export class GridFilterPipe {
    constructor() { }
    transform(value, filterStateDict, sortStateDict) {
        let queryEnumerable = Query.from(value);
        if (filterStateDict.length > 0) {
            for (const filterState of filterStateDict) {
                if (filterState.value.filter) {
                    queryEnumerable = queryEnumerable.filter(filterState.value.filter, r => r.data);
                }
            }
        }
        if (sortStateDict.length > 0) {
            queryEnumerable = queryEnumerable.sort(sortStateDict
                .values()
                .select(d => d.sort)
                .toArray(), r => r.data);
        }
        return queryEnumerable.run();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridFilterPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: GridFilterPipe, name: "gridFilter" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridFilterPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: "gridFilter"
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1maWx0ZXIucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9ncmlkL3BpcGVzL2dyaWQtZmlsdGVyLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDcEQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHdCQUF3QixDQUFDOztBQVMvQyxNQUFNLE9BQU8sY0FBYztJQUN2QixnQkFBc0IsQ0FBQztJQUVoQixTQUFTLENBQ1osS0FBWSxFQUNaLGVBQXNELEVBQ3RELGFBQWtEO1FBRWxELElBQUksZUFBZSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEMsSUFBSSxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM1QixLQUFLLE1BQU0sV0FBVyxJQUFJLGVBQWUsRUFBRTtnQkFDdkMsSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtvQkFDMUIsZUFBZSxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ25GO2FBQ0o7U0FDSjtRQUNELElBQUksYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDMUIsZUFBZSxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQ2xDLGFBQWE7aUJBQ1IsTUFBTSxFQUFFO2lCQUNSLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7aUJBQ25CLE9BQU8sRUFBRSxFQUNkLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDZCxDQUFDO1NBQ0w7UUFDRCxPQUFPLGVBQWUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNqQyxDQUFDOzhHQTFCUSxjQUFjOzRHQUFkLGNBQWM7OzJGQUFkLGNBQWM7a0JBSDFCLElBQUk7bUJBQUM7b0JBQ0YsSUFBSSxFQUFFLFlBQVk7aUJBQ3JCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBRdWVyeSB9IGZyb20gXCIuLi8uLi9xdWVyeS9jb3JlL1F1ZXJ5XCI7XG5pbXBvcnQgeyBEaWN0aW9uYXJ5IH0gZnJvbSBcIkBtaXJlaS90cy1jb2xsZWN0aW9uc1wiO1xuaW1wb3J0IHsgQ29sdW1uRmlsdGVyU3RhdGUgfSBmcm9tIFwiLi4vbW9kZWxzL0NvbHVtbkZpbHRlclN0YXRlXCI7XG5pbXBvcnQgeyBDb2x1bW5Tb3J0U3RhdGUgfSBmcm9tIFwiLi4vbW9kZWxzL0NvbHVtblNvcnRTdGF0ZVwiO1xuaW1wb3J0IHsgUm93IH0gZnJvbSBcIi4uL21vZGVscy9Sb3dcIjtcblxuQFBpcGUoe1xuICAgIG5hbWU6IFwiZ3JpZEZpbHRlclwiXG59KVxuZXhwb3J0IGNsYXNzIEdyaWRGaWx0ZXJQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge31cblxuICAgIHB1YmxpYyB0cmFuc2Zvcm0oXG4gICAgICAgIHZhbHVlOiBSb3dbXSxcbiAgICAgICAgZmlsdGVyU3RhdGVEaWN0OiBEaWN0aW9uYXJ5PHN0cmluZywgQ29sdW1uRmlsdGVyU3RhdGU+LFxuICAgICAgICBzb3J0U3RhdGVEaWN0OiBEaWN0aW9uYXJ5PHN0cmluZywgQ29sdW1uU29ydFN0YXRlPlxuICAgICk6IFJvd1tdIHtcbiAgICAgICAgbGV0IHF1ZXJ5RW51bWVyYWJsZSA9IFF1ZXJ5LmZyb20odmFsdWUpO1xuICAgICAgICBpZiAoZmlsdGVyU3RhdGVEaWN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZmlsdGVyU3RhdGUgb2YgZmlsdGVyU3RhdGVEaWN0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbHRlclN0YXRlLnZhbHVlLmZpbHRlcikge1xuICAgICAgICAgICAgICAgICAgICBxdWVyeUVudW1lcmFibGUgPSBxdWVyeUVudW1lcmFibGUuZmlsdGVyKGZpbHRlclN0YXRlLnZhbHVlLmZpbHRlciwgciA9PiByLmRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoc29ydFN0YXRlRGljdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBxdWVyeUVudW1lcmFibGUgPSBxdWVyeUVudW1lcmFibGUuc29ydChcbiAgICAgICAgICAgICAgICBzb3J0U3RhdGVEaWN0XG4gICAgICAgICAgICAgICAgICAgIC52YWx1ZXMoKVxuICAgICAgICAgICAgICAgICAgICAuc2VsZWN0KGQgPT4gZC5zb3J0KVxuICAgICAgICAgICAgICAgICAgICAudG9BcnJheSgpLFxuICAgICAgICAgICAgICAgIHIgPT4gci5kYXRhXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBxdWVyeUVudW1lcmFibGUucnVuKCk7XG4gICAgfVxufVxuIl19