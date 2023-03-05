import { Pipe, PipeTransform } from "@angular/core";
import { Column } from "../models/Column";
import { Enumerable } from "@mirei/ts-collections";
import { Row } from "../models/Row";
import { GridGroup } from "../models/GridGroup";
import { GridService } from "../services/grid.service";

@Pipe({
    name: "gridGroup"
})
export class GridGroupPipe implements PipeTransform {
    public constructor(private readonly gridService: GridService) {}
    public transform(value: Row[], column: Column, page: number): Array<GridGroup> {
        return Enumerable.from(value)
            .groupBy(d => d.data[column.field])
            .select<GridGroup>(g => {
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
}
