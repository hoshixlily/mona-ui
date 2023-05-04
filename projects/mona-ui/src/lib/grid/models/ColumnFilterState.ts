import { CompositeFilterDescriptor } from "../../query/filter/FilterDescriptor";
import { FilterMenuValue } from "../../filter/models/FilterMenuValue";

export interface ColumnFilterState {
    filter?: CompositeFilterDescriptor;
    filterMenuValue?: FilterMenuValue;
}
