import { OrderComparator } from "@mirei/ts-collections";

export interface SortDescriptor {
    field: string;
    dir: "asc" | "desc";
    sort?: OrderComparator<any>;
}
