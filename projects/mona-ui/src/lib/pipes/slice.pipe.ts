import { Pipe, PipeTransform } from "@angular/core";
import { Enumerable } from "@mirei/ts-collections";

@Pipe({
    name: "monaSlice",
    standalone: true
})
export class SlicePipe implements PipeTransform {
    transform<T>(value: Iterable<T>, start: number, end: number): T[] {
        return Enumerable.from(value)
            .skip(start)
            .take(end - start)
            .toArray();
    }
}
