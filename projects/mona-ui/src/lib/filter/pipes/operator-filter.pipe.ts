import { Pipe, PipeTransform } from "@angular/core";
import { FilterOperators } from "../../query/filter/FilterDescriptor";
import { FilterMenuDataItem } from "../models/FilterMenuDataItem";

@Pipe({
    name: "operatorFilter"
})
export class OperatorFilterPipe implements PipeTransform {
    public transform(value: FilterMenuDataItem[], visibleOperators?: FilterOperators[]): FilterMenuDataItem[] {
        if (!visibleOperators || visibleOperators.length === 0) {
            return value;
        }
        return value
            .filter(item => visibleOperators.includes(item.value))
            .sort((a, b) => {
                return visibleOperators.indexOf(a.value) - visibleOperators.indexOf(b.value);
            });
    }
}
