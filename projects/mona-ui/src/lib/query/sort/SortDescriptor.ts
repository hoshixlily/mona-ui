import { OrderComparator } from "@mirei/ts-collections";

export interface SortDescriptor<T = any> {
    dir: SortDirection;
    field: string;
    sort?: OrderComparator<T>;
}

export type SortDirection = "asc" | "desc";
