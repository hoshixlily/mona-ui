import { Pipe, PipeTransform } from "@angular/core";
import { FilterOperators } from "../../query/filter/FilterDescriptor";
import { FilterMenuDataItem } from "../models/FilterMenuDataItem";

@Pipe({
    name: "operatorFilter",
    standalone: true
})
export class OperatorFilterPipe implements PipeTransform {
    public transform(value: FilterMenuDataItem[], visibleOperators?: Iterable<FilterOperators>): FilterMenuDataItem[] {
        if (!visibleOperators) {
            return value;
        }
        const operators = Array.from(visibleOperators);
        if (!operators.length) {
            return value;
        }
        return value
            .filter(item => operators.includes(item.value))
            .sort((a, b) => {
                return operators.indexOf(a.value) - operators.indexOf(b.value);
            });
    }
}
