import { Pipe, PipeTransform } from "@angular/core";
import { Enumerable } from "@mirei/ts-collections";

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
            return Enumerable.from(sequence).contains(value as any);
        }
        if (Symbol.iterator in Object(value)) {
            const enumerableSequence = Enumerable.from(sequence);
            return Enumerable.from(value as Iterable<T>).all(item => enumerableSequence.contains(item));
        }
        return Enumerable.from(sequence).contains(value as T);
    }
}
