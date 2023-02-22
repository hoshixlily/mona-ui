import { FilterOperators } from "./FilterOperators";

export interface FilterDescriptor2<T = unknown> {
    field: string;
    operator: FilterOperators;
    value: T | T[];
}

export type FilterDescriptor<T = unknown> =
    | {
          field: string;
          operator: Exclude<FilterOperators, "isnull" | "isnotnull">;
          value: T | T[];
      }
    | {
          field: string;
          operator: "isnull" | "isnotnull";
      };

export interface CompositeFilterDescriptor<T = unknown> {
    logic: "and" | "or";
    filters: Array<FilterDescriptor<T> | CompositeFilterDescriptor<T>>;
}
