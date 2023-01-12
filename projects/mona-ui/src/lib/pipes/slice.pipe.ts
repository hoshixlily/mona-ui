import { Pipe, PipeTransform } from "@angular/core";
import { IEnumerable } from "@mirei/ts-collections";

@Pipe({
    name: "monaSlice"
})
export class SlicePipe implements PipeTransform {
    transform<T>(value: IEnumerable<T>, start: number, end: number): T[] {
        return value
            .skip(start)
            .take(end - start)
            .toArray();
    }
}
