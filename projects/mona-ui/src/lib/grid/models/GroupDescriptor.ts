import { SortDirection } from "../../query/sort/SortDescriptor";

export interface GroupDescriptor {
    field: string;
    dir?: SortDirection;
}
