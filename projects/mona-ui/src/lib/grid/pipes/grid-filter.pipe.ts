import { Pipe, PipeTransform } from "@angular/core";
import { IQuery, Query } from "../../query/core/Query";
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
        queryEnumerable = this.applyFilterStatesIfExists(filterStateDict, queryEnumerable);
        queryEnumerable = this.applySortStatesIfExists(sortStateDict, queryEnumerable);
        return queryEnumerable.run();
    }

    private applyFilterStatesIfExists(
        filterStateDict: Dictionary<string, ColumnFilterState>,
        queryEnumerable: IQuery<Row>
    ): IQuery<Row> {
        if (filterStateDict.length > 0) {
            for (const filterState of filterStateDict) {
                if (filterState.value.filter) {
                    queryEnumerable = queryEnumerable.filter(filterState.value.filter, r => r.data);
                }
            }
        }
        return queryEnumerable;
    }

    private applySortStatesIfExists(
        sortStateDict: Dictionary<string, ColumnSortState>,
        queryEnumerable: IQuery<Row>
    ): IQuery<Row> {
        if (sortStateDict.length > 0) {
            const sortState = sortStateDict
                .values()
                .select(d => d.sort)
                .toArray();
            queryEnumerable = queryEnumerable.sort(sortState, r => r.data);
        }
        return queryEnumerable;
    }
}
