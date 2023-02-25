import { Pipe, PipeTransform } from "@angular/core";
import { CompositeFilterDescriptor } from "../../query/filter/FilterDescriptor";
import { Query } from "../../query/core/Query";
import { Dictionary } from "@mirei/ts-collections";
import { ColumnFilterState } from "../models/ColumnFilterState";

@Pipe({
    name: "gridFilter"
})
export class GridFilterPipe implements PipeTransform {
    public transform(value: any[], filters: Dictionary<string, ColumnFilterState>): any[] {
        let queryEnumerable = Query.from(value);
        if (filters.length > 0) {
            for (const filter of filters) {
                if (filter.value.filter) {
                    queryEnumerable = queryEnumerable.filter(filter.value.filter);
                }
            }
        }
        const result = queryEnumerable.run();
        return result;
    }
}
