import { Pipe, PipeTransform } from "@angular/core";
import { Column } from "../models/Column";
import { Enumerable } from "@mirei/ts-collections";

@Pipe({
    name: "gridGroup"
})
export class GridGroupPipe implements PipeTransform {
    public transform(value: any[], column: Column): Array<{ rows: any[]; collapsed: boolean }> {
        return Enumerable.from(value)
            .groupBy(d => d[column.field])
            .select(g => {
                return {
                    rows: g.source.toArray(),
                    collapsed: false
                };
            })
            .toArray();
    }
}
