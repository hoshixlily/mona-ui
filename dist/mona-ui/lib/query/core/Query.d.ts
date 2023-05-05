import { CompositeFilterDescriptor, FilterDescriptor } from "../filter/FilterDescriptor";
import { Enumerator, Selector } from "@mirei/ts-collections";
import { SortDescriptor } from "../sort/SortDescriptor";
export interface IQuery<T> extends Iterable<T> {
    filter(filter: FilterDescriptor | CompositeFilterDescriptor, fieldSelector?: Selector<T, any>): IQuery<T>;
    run(): T[];
    sort(descriptor: SortDescriptor[], fieldSelector?: Selector<T, any>): IQuery<T>;
}
export declare class Query<T> implements IQuery<T> {
    private readonly iterable;
    private readonly enumerator;
    private constructor();
    [Symbol.iterator](): Iterator<T>;
    static from<T>(iterable: Iterable<T>): IQuery<T>;
    filter(filter: FilterDescriptor | CompositeFilterDescriptor, fieldSelector?: Selector<T, any>): IQuery<T>;
    run(): T[];
    sort(descriptor: SortDescriptor[], fieldSelector?: Selector<T, any>): IQuery<T>;
}
export declare class QueryEnumerator<T> extends Enumerator<T> implements IQuery<T> {
    constructor(iterable: () => Iterable<T>);
    filter(filter: FilterDescriptor | CompositeFilterDescriptor, fieldSelector?: Selector<T, any>): IQuery<T>;
    run(): T[];
    sort(descriptor: SortDescriptor[], fieldSelector?: Selector<T, any>): IQuery<T>;
    private filterGenerator;
    private sortGenerator;
}
