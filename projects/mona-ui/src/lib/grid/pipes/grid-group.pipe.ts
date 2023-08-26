import { Pipe, PipeTransform } from "@angular/core";
import { Column } from "../models/Column";
import { Enumerable, IGroup } from "@mirei/ts-collections";
import { Row } from "../models/Row";
import { GridGroup } from "../models/GridGroup";
import { GridService } from "../services/grid.service";

@Pipe({
    name: "gridGroup",
    standalone: true
})
export class GridGroupPipe implements PipeTransform {
    public constructor(private readonly gridService: GridService) {}

    public transform(value: Row[], column: Column, page: number): Array<GridGroup> {
        return Enumerable.from(value)
            .groupBy(row => row.data[column.field], this.cellComparer(column))
            .select(g => this.createGridGroup(g, column, page))
            .toArray();
    }

    private cellComparer(column: Column) {
        return (r1: any, r2: any) => {
            if (column.dataType === "date") {
                if (r1 == null || r2 == null) {
                    return Object.is(r1, r2);
                }
                return this.compareDates(r1 as Date, r2 as Date);
            }
            return Object.is(r1, r2);
        };
    }

    private compareDates(date1: Date, date2: Date): boolean {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate() &&
            date1.getHours() === date2.getHours() &&
            date1.getMinutes() === date2.getMinutes() &&
            date1.getSeconds() === date2.getSeconds()
        );
    }

    private createGridGroup(group: IGroup<any, Row>, column: Column, page: number): GridGroup {
        const rows = group.source.toArray();
        const groupKey = this.getGroupKey(column.field, rows);
        const collapsed = this.gridService.gridGroupExpandState.get(groupKey)?.get(page) ?? false;
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
