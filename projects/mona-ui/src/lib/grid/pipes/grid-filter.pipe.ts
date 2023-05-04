import { Pipe, PipeTransform } from "@angular/core";
import { Query } from "../../query/core/Query";
import { Dictionary } from "@mirei/ts-collections";
import { ColumnFilterState } from "../models/ColumnFilterState";
import { ColumnSortState } from "../models/ColumnSortState";
import { Row } from "../models/Row";

@Pipe({
    name: "gridFilter"
})
export class GridFilterPipe implements PipeTransform {
    public constructor() {}

    public transform(
        value: Row[],
        filterStateDict: Dictionary<string, ColumnFilterState>,
        sortStateDict: Dictionary<string, ColumnSortState>
    ): Row[] {
        let queryEnumerable = Query.from(value);
        if (filterStateDict.length > 0) {
            for (const filterState of filterStateDict) {
                if (filterState.value.filter) {
                    queryEnumerable = queryEnumerable.filter(filterState.value.filter, r => r.data);
                }
            }
        }
        if (sortStateDict.length > 0) {
            queryEnumerable = queryEnumerable.sort(
                sortStateDict
                    .values()
                    .select(d => d.sort)
                    .toArray(),
                r => r.data
            );
        }
        return queryEnumerable.run();
    }
}
