import { Pipe, PipeTransform } from "@angular/core";
import { Query } from "../../query/core/Query";
import { Dictionary } from "@mirei/ts-collections";
import { ColumnFilterState } from "../models/ColumnFilterState";
import { ColumnSortState } from "../models/ColumnSortState";

@Pipe({
    name: "gridFilter"
})
export class GridFilterPipe implements PipeTransform {
    public transform(
        value: any[],
        filterStateDict: Dictionary<string, ColumnFilterState>,
        sortStateDict: Dictionary<string, ColumnSortState>
    ): any[] {
        let queryEnumerable = Query.from(value);
        if (filterStateDict.length > 0) {
            for (const filter of filterStateDict) {
                if (filter.value.filter) {
                    queryEnumerable = queryEnumerable.filter(filter.value.filter);
                }
            }
        }
        if (sortStateDict.length > 0) {
            for (const sortState of sortStateDict) {
                if (sortState.value.sort) {
                    queryEnumerable = queryEnumerable.sort([sortState.value.sort]);
                }
            }
        }
        return queryEnumerable.run();
    }
}
