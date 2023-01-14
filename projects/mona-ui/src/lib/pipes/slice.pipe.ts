import { Pipe, PipeTransform } from "@angular/core";
import { IEnumerable } from "@mirei/ts-collections";

@Pipe({
    name: "monaSlice",
    standalone: true
})
export class SlicePipe implements PipeTransform {
    transform<T>(value: IEnumerable<T>, start: number, end: number): T[] {
        return value
            .skip(start)
            .take(end - start)
            .toArray();
    }
}
