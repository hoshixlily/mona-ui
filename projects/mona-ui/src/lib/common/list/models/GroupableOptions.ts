import { Selector } from "@mirei/ts-collections";

type OrderByOptions<T, R> =
    | { orderBy?: never; orderByDirection?: never }
    | {
          /**
           * The field to order the items of per group. If not specified, the items of the group will not be ordered.
           */
          orderBy: string | Selector<T, R>;

          /**
           * The direction to order the items of per group.
           */
          orderByDirection?: "asc" | "desc";
      };

export type GroupableOptions<T, R> = {
    /**
     * Whether to group the items. If not specified, the items will not be grouped.
     */
    enabled?: boolean;

    /**
     * The direction to order the group headers.
     * If not specified, the group headers will be ordered in ascending order.
     */
    headerOrder?: "asc" | "desc";
} & OrderByOptions<T, R>;
