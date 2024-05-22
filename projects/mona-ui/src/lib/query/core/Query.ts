import { Enumerator, Selector } from "@mirei/ts-collections";
import { CompositeFilterDescriptor, FilterDescriptor } from "../filter/FilterDescriptor";
import { compositeDescriptorToPredicate, descriptorToPredicate } from "../filter/FilterUtils";
import { SortDescriptor } from "../sort/SortDescriptor";

export interface IQuery<T> extends Iterable<T> {
    filter<R>(filter: FilterDescriptor | CompositeFilterDescriptor, fieldSelector?: Selector<T, R>): IQuery<T>;

    run(): T[];

    sort<R>(descriptor: SortDescriptor<T>[], fieldSelector?: Selector<T, R>): IQuery<T>;
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

    public filter<R>(filter: FilterDescriptor | CompositeFilterDescriptor, fieldSelector?: Selector<T, R>): IQuery<T> {
        return this.enumerator.filter(filter, fieldSelector);
    }

    public run(): T[] {
        return this.enumerator.toArray();
    }

    public sort<R>(descriptor: SortDescriptor<T>[], fieldSelector?: Selector<T, R>): IQuery<T> {
        return this.enumerator.sort(descriptor, fieldSelector);
    }
}

export class QueryEnumerator<T> extends Enumerator<T> implements IQuery<T> {
    public constructor(iterable: () => Iterable<T>) {
        super(iterable);
    }

    public filter<R>(filter: FilterDescriptor | CompositeFilterDescriptor, fieldSelector?: Selector<T, R>): IQuery<T> {
        return new QueryEnumerator(() => this.filterGenerator(filter, fieldSelector));
    }

    public run(): T[] {
        return Array.from(this);
    }

    public sort<R>(descriptor: SortDescriptor<T>[], fieldSelector?: Selector<T, R>): IQuery<T> {
        return new QueryEnumerator(() => this.sortGenerator(descriptor, fieldSelector));
    }

    private *filterGenerator<R>(
        filter: FilterDescriptor | CompositeFilterDescriptor,
        fieldSelector?: Selector<T, R>
    ): Iterable<T> {
        const predicate = filter.hasOwnProperty("field")
            ? descriptorToPredicate(filter as FilterDescriptor, fieldSelector)
            : compositeDescriptorToPredicate(filter as CompositeFilterDescriptor, fieldSelector);
        yield* this.where(predicate);
    }

    private *sortGenerator<R>(descriptor: SortDescriptor<T>[], fieldSelector?: Selector<T, R>): Iterable<T> {
        let result =
            descriptor[0].dir === "asc"
                ? this.orderBy(
                      d => (fieldSelector ? fieldSelector(d) : (d as any))[descriptor[0].field],
                      descriptor[0].sort
                  )
                : this.orderByDescending(
                      d => (fieldSelector ? fieldSelector(d) : (d as any))[descriptor[0].field],
                      descriptor[0].sort
                  );
        for (let i = 1; i < descriptor.length; i++) {
            result =
                descriptor[i].dir === "asc"
                    ? result.thenBy(
                          d => (fieldSelector ? fieldSelector(d) : (d as any))[descriptor[i].field],
                          descriptor[i].sort
                      )
                    : result.thenByDescending(
                          d => (fieldSelector ? fieldSelector(d) : (d as any))[descriptor[i].field],
                          descriptor[i].sort
                      );
        }
        yield* result;
    }
}
