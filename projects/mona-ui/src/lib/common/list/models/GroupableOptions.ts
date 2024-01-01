import { Selector } from "@mirei/ts-collections";

type OrderByOptions<T, R> =
    | { orderBy?: never; orderByDirection?: never }
    | { orderBy: string | Selector<T, R>; orderByDirection?: "asc" | "desc" };

export type GroupableOptions<T, R> = { enabled?: boolean; headerOrder?: "asc" | "desc" } & OrderByOptions<T, R>;
