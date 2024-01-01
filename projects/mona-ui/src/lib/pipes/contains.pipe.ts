import { Pipe, PipeTransform } from "@angular/core";
import { Enumerable, EnumerableSet, ImmutableSet, ImmutableSortedSet, SortedSet } from "@mirei/ts-collections";

@Pipe({
    name: "monaContains",
    standalone: true
})
export class ContainsPipe implements PipeTransform {
    public transform<T>(sequence: Iterable<T> | null | undefined, value: T | Iterable<T>): boolean {
        if (sequence == null) {
            return false;
        }
        if (typeof value === "string") {
            if (
                sequence instanceof EnumerableSet ||
                sequence instanceof ImmutableSet ||
                sequence instanceof SortedSet ||
                sequence instanceof ImmutableSortedSet
            ) {
                return sequence.contains(value);
            }
        }
        if (Symbol.iterator in Object(value)) {
            const enumerableSequence = Enumerable.from(sequence);
            return Enumerable.from(value as Iterable<T>).all(item => enumerableSequence.contains(item));
        }
        return Enumerable.from(sequence).contains(value as T);
    }
}
