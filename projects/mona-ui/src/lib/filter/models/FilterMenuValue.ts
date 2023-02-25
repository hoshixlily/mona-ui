import { FilterOperators } from "../../query/filter/FilterDescriptor";

export interface FilterMenuValue {
    logic?: "and" | "or";
    operator1?: FilterOperators;
    operator2?: FilterOperators;
    value1?: any;
    value2?: any;
}
