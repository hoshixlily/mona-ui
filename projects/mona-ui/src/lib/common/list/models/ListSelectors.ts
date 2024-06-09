import { Selector } from "@mirei/ts-collections";

export type ListKeySelector<T, K = any> = string | Selector<T, K> | null;
