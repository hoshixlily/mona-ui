import { Predicate } from "@mirei/ts-collections";

export type CommonFilterOperators = "eq" | "neq";
export type NumericFilterOperators = CommonFilterOperators | "gt" | "gte" | "lt" | "lte";
export type StringFilterOperators = CommonFilterOperators | "startswith" | "endswith" | "contains" | "doesnotcontain";
export type NullFilterOperators = "isnull" | "isnotnull";
export type EmptyFilterOperators = "isempty" | "isnotempty";
export type NullOrEmptyFilterOperators = "isnullorempty" | "isnotnullorempty";
export type ArrayFilterOperators = "in" | "notin";
export type RangeFilterOperators = "between" | "notbetween";
export type FunctionFilterOperators = "function";
export type FieldDefinition = { field: string };
export type CommonFilterDescriptor = FieldDefinition & { operator: CommonFilterOperators; value: any };
export type NumericFilterDescriptor = FieldDefinition & { operator: NumericFilterOperators; value: number };
export type StringFilterDescriptor = FieldDefinition & { operator: StringFilterOperators; value: string };
export type NullFilterDescriptor = FieldDefinition & { operator: NullFilterOperators };
export type EmptyFilterDescriptor = FieldDefinition & { operator: EmptyFilterOperators };
export type NullOrEmptyFilterDescriptor = FieldDefinition & { operator: NullOrEmptyFilterOperators };
export type ArrayFilterDescriptor = FieldDefinition & { operator: ArrayFilterOperators; value: any[] };
export type RangeFilterDescriptor = FieldDefinition & { operator: RangeFilterOperators; value: [number, number] };
export type FunctionFilterDescriptor = FieldDefinition & {
    operator: FunctionFilterOperators;
    value: Predicate<any>;
};

export type FilterDescriptor =
    | CommonFilterDescriptor
    | NumericFilterDescriptor
    | StringFilterDescriptor
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
