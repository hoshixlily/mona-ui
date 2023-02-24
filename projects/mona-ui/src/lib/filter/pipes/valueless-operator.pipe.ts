import { Pipe, PipeTransform } from "@angular/core";
import { FilterOperators } from "../../query/filter/FilterDescriptor";

@Pipe({
    name: "valuelessOperator"
})
export class ValuelessOperatorPipe implements PipeTransform {
    public transform(value: FilterOperators | undefined): boolean {
        return (
            value === "isnull" ||
            value === "isnotnull" ||
            value === "isempty" ||
            value === "isnotempty" ||
            value === "isnullorempty" ||
            value === "isnotnullorempty"
        );
    }
}
