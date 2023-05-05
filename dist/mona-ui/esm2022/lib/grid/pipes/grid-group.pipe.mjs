import { Pipe } from "@angular/core";
import { Enumerable } from "@mirei/ts-collections";
import * as i0 from "@angular/core";
import * as i1 from "../services/grid.service";
export class GridGroupPipe {
    constructor(gridService) {
        this.gridService = gridService;
    }
    transform(value, column, page) {
        return Enumerable.from(value)
            .groupBy(d => d.data[column.field])
            .select(g => {
            const rows = g.source.toArray();
            const groupKey = `${column.field}-${rows[0].data[column.field]}`;
            const collapsed = this.gridService.gridGroupExpandState.get(groupKey)?.get(page) ?? false;
            return {
                column,
                rows,
                collapsed
            };
        })
            .toArray();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridGroupPipe, deps: [{ token: i1.GridService }], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: GridGroupPipe, name: "gridGroup" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridGroupPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: "gridGroup"
                }]
        }], ctorParameters: function () { return [{ type: i1.GridService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1ncm91cC5waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9uYS11aS9zcmMvbGliL2dyaWQvcGlwZXMvZ3JpZC1ncm91cC5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBRXBELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQzs7O0FBUW5ELE1BQU0sT0FBTyxhQUFhO0lBQ3RCLFlBQW9DLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBQUcsQ0FBQztJQUN6RCxTQUFTLENBQUMsS0FBWSxFQUFFLE1BQWMsRUFBRSxJQUFZO1FBQ3ZELE9BQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDeEIsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDbEMsTUFBTSxDQUFZLENBQUMsQ0FBQyxFQUFFO1lBQ25CLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDaEMsTUFBTSxRQUFRLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDakUsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQztZQUMxRixPQUFPO2dCQUNILE1BQU07Z0JBQ04sSUFBSTtnQkFDSixTQUFTO2FBQ1osQ0FBQztRQUNOLENBQUMsQ0FBQzthQUNELE9BQU8sRUFBRSxDQUFDO0lBQ25CLENBQUM7OEdBaEJRLGFBQWE7NEdBQWIsYUFBYTs7MkZBQWIsYUFBYTtrQkFIekIsSUFBSTttQkFBQztvQkFDRixJQUFJLEVBQUUsV0FBVztpQkFDcEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IENvbHVtbiB9IGZyb20gXCIuLi9tb2RlbHMvQ29sdW1uXCI7XG5pbXBvcnQgeyBFbnVtZXJhYmxlIH0gZnJvbSBcIkBtaXJlaS90cy1jb2xsZWN0aW9uc1wiO1xuaW1wb3J0IHsgUm93IH0gZnJvbSBcIi4uL21vZGVscy9Sb3dcIjtcbmltcG9ydCB7IEdyaWRHcm91cCB9IGZyb20gXCIuLi9tb2RlbHMvR3JpZEdyb3VwXCI7XG5pbXBvcnQgeyBHcmlkU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9ncmlkLnNlcnZpY2VcIjtcblxuQFBpcGUoe1xuICAgIG5hbWU6IFwiZ3JpZEdyb3VwXCJcbn0pXG5leHBvcnQgY2xhc3MgR3JpZEdyb3VwUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGdyaWRTZXJ2aWNlOiBHcmlkU2VydmljZSkge31cbiAgICBwdWJsaWMgdHJhbnNmb3JtKHZhbHVlOiBSb3dbXSwgY29sdW1uOiBDb2x1bW4sIHBhZ2U6IG51bWJlcik6IEFycmF5PEdyaWRHcm91cD4ge1xuICAgICAgICByZXR1cm4gRW51bWVyYWJsZS5mcm9tKHZhbHVlKVxuICAgICAgICAgICAgLmdyb3VwQnkoZCA9PiBkLmRhdGFbY29sdW1uLmZpZWxkXSlcbiAgICAgICAgICAgIC5zZWxlY3Q8R3JpZEdyb3VwPihnID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByb3dzID0gZy5zb3VyY2UudG9BcnJheSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGdyb3VwS2V5ID0gYCR7Y29sdW1uLmZpZWxkfS0ke3Jvd3NbMF0uZGF0YVtjb2x1bW4uZmllbGRdfWA7XG4gICAgICAgICAgICAgICAgY29uc3QgY29sbGFwc2VkID0gdGhpcy5ncmlkU2VydmljZS5ncmlkR3JvdXBFeHBhbmRTdGF0ZS5nZXQoZ3JvdXBLZXkpPy5nZXQocGFnZSkgPz8gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgICAgICAgICAgICByb3dzLFxuICAgICAgICAgICAgICAgICAgICBjb2xsYXBzZWRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50b0FycmF5KCk7XG4gICAgfVxufVxuIl19