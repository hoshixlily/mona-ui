import { Predicate } from "@mirei/ts-collections";

export type CommonFilterOperators = "eq" | "neq";
export type NullFilterOperators = "isnull" | "isnotnull";
export type EmptyFilterOperators = "isempty" | "isnotempty";
export type NullOrEmptyFilterOperators = "isnullorempty" | "isnotnullorempty";

export type BooleanFilterOperators = CommonFilterOperators | NullFilterOperators;

export type NumericFilterOperators = CommonFilterOperators | "gt" | "gte" | "lt" | "lte" | NullFilterOperators;

export type StringFilterOperators =
    | CommonFilterOperators
    | "startswith"
    | "endswith"
    | "contains"
    | "doesnotcontain"
    | NullFilterOperators
    | EmptyFilterOperators
    | NullOrEmptyFilterOperators;

export type DateFilterOperators = NumericFilterOperators | NullFilterOperators;

export type ArrayFilterOperators = "in" | "notin";

export type RangeFilterOperators = "between" | "notbetween";

export type FunctionFilterOperators = "function";

export type FilterOperators =
    | CommonFilterOperators
    | BooleanFilterOperators
    | NumericFilterOperators
    | StringFilterOperators
    | DateFilterOperators
    | NullFilterOperators
    | EmptyFilterOperators
    | NullOrEmptyFilterOperators
    | ArrayFilterOperators
    | RangeFilterOperators
    | FunctionFilterOperators;

export type FieldDefinition = { field: string };
export type CommonFilterDescriptor = FieldDefinition & { operator: CommonFilterOperators; value: any };

export type NullFilterDescriptor = FieldDefinition & { operator: NullFilterOperators };
export type EmptyFilterDescriptor = FieldDefinition & { operator: EmptyFilterOperators };
export type NullOrEmptyFilterDescriptor = FieldDefinition & { operator: NullOrEmptyFilterOperators };

export type BooleanFilterDescriptor = CommonFilterDescriptor | NullFilterDescriptor;

export type NumericFilterDescriptor = FieldDefinition &
    (
        | {
              operator: NumericFilterOperators;
              value: number;
          }
        | NullFilterDescriptor
    );

export type StringFilterDescriptor = FieldDefinition &
    (
        | {
              operator: StringFilterOperators;
              value: string;
          }
        | NullFilterDescriptor
        | EmptyFilterDescriptor
        | NullOrEmptyFilterDescriptor
    );

export type DateFilterDescriptor = FieldDefinition &
    (
        | {
              operator: DateFilterOperators;
              value: Date;
          }
        | NullFilterDescriptor
    );

export type ArrayFilterDescriptor = FieldDefinition & { operator: ArrayFilterOperators; value: any[] };

export type RangeFilterDescriptor = FieldDefinition & { operator: RangeFilterOperators; value: [number, number] };

export type FunctionFilterDescriptor = FieldDefinition & {
    operator: FunctionFilterOperators;
    predicate: Predicate<any>;
};

export type FilterDescriptor =
    | CommonFilterDescriptor
    | BooleanFilterDescriptor
    | NumericFilterDescriptor
    | StringFilterDescriptor
    | DateFilterDescriptor
    | NullFilterDescriptor
    | EmptyFilterDescriptor
    | NullOrEmptyFilterDescriptor
    | ArrayFilterDescriptor
    | RangeFilterDescriptor
    | FunctionFilterDescriptor;

export interface CompositeFilterDescriptor {
    logic: "and" | "or";
    filters: Array<FilterDescriptor | CompositeFilterDescriptor>;
}
