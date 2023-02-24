import { CompositeFilterDescriptor, FilterDescriptor } from "../filter/FilterDescriptor";
import { Enumerator } from "@mirei/ts-collections";
import { FilterUtils } from "../filter/FilterUtils";
import { SortDescriptor } from "../sort/SortDescriptor";

export interface IQuery<T> {
    filter(filter: FilterDescriptor | CompositeFilterDescriptor): IQuery<T>;

    run(): T[];

    sort(descriptor: SortDescriptor[]): IQuery<T>;
}

export class Query<T> implements IQuery<T> {
    private readonly enumerator: QueryEnumerator<T>;

    private constructor(private readonly iterable: Iterable<T>) {
        this.enumerator = new QueryEnumerator(() => iterable);
    }

    *[Symbol.iterator](): Iterator<T> {
        yield* this.iterable;
    }

    public static from<T>(iterable: Iterable<T>): IQuery<T> {
        return new Query(iterable);
    }

    public filter(filter: FilterDescriptor | CompositeFilterDescriptor): IQuery<T> {
        return this.enumerator.filter(filter);
    }

    public run(): T[] {
        return this.enumerator.toArray();
    }

    public sort(descriptor: SortDescriptor[]): IQuery<T> {
        return this.enumerator.sort(descriptor);
    }
}

export class QueryEnumerator<T> extends Enumerator<T> implements IQuery<T> {
    public constructor(iterable: () => Iterable<T>) {
        super(iterable);
    }

    public filter(filter: FilterDescriptor | CompositeFilterDescriptor): IQuery<T> {
        return new QueryEnumerator(() => this.filterGenerator(filter));
    }

    public run(): T[] {
        return Array.from(this);
    }

    public sort(descriptor: SortDescriptor[]): IQuery<T> {
        return new QueryEnumerator(() => this.sortGenerator(descriptor));
    }

    private *filterGenerator(filter: FilterDescriptor | CompositeFilterDescriptor): Iterable<T> {
        const predicate = filter.hasOwnProperty("field")
            ? FilterUtils.descriptorToPredicate(filter as FilterDescriptor)
            : FilterUtils.compositeDescriptorToPredicate(filter as CompositeFilterDescriptor);
        yield* this.where(predicate);
    }

    private *sortGenerator(descriptor: SortDescriptor[]): Iterable<T> {
        let result =
            descriptor[0].dir === "asc"
                ? this.orderBy(d => (d as any)[descriptor[0].field], descriptor[0].sort)
                : this.orderByDescending(d => (d as any)[descriptor[0].field], descriptor[0].sort);
        for (let i = 1; i < descriptor.length; i++) {
            result =
                descriptor[i].dir === "asc"
                    ? result.thenBy(d => (d as any)[descriptor[i].field], descriptor[i].sort)
                    : result.thenByDescending(d => (d as any)[descriptor[i].field], descriptor[i].sort);
        }
        yield* result;
    }
}
