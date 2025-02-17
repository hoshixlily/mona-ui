import { inject, Pipe, PipeTransform } from "@angular/core";
import { from, IGroup } from "@mirei/ts-collections";
import { Column } from "../models/Column";
import { GridGroup } from "../models/GridGroup";
import { Row } from "../models/Row";
import { GridService } from "../services/grid.service";
import { cellComparer } from "../utilities/GridUtils";

@Pipe({
    name: "gridGroup",
    standalone: true
})
export class GridGroupPipe implements PipeTransform {
    readonly #gridService = inject(GridService);

    public transform(value: Row[], column: Column, page: number): Array<GridGroup> {
        return from(value)
            .groupBy(row => row.data[column.field()], cellComparer(column))
            .select(g => this.createGridGroup(g, column, page))
            .toArray();
    }

    private createGridGroup(group: IGroup<unknown, Row>, column: Column, page: number): GridGroup {
        const rows = group.source.toArray();
        const groupKey = this.getGroupKey(column.field(), rows);
        const collapsed = this.#gridService.gridGroupExpandState.get(groupKey)?.get(page) ?? false;
        return {
            column,
            rows,
            collapsed
        };
    }

    private getGroupKey(field: string, rows: Row[]): string {
        return `${field}-${rows[0].data[field]}`;
    }
}
