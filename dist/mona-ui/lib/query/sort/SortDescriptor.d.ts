import { OrderComparator } from "@mirei/ts-collections";
export interface SortDescriptor {
    dir: "asc" | "desc";
    field: string;
    sort?: OrderComparator<any>;
}
