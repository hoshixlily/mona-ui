import { Selector } from "@mirei/ts-collections";
import { Observable } from "rxjs";

export type ChildrenSelector<T> = string | Selector<T, Iterable<T> | Observable<Iterable<T>>>;
export type NodeKeySelector<T, K = any> = string | Selector<T, K> | null;
