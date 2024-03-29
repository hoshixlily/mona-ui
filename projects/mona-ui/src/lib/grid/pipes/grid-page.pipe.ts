import { Pipe, PipeTransform } from "@angular/core";
import { any, count, from } from "@mirei/ts-collections";

@Pipe({
    name: "gridPage",
    standalone: true
})
export class GridPagePipe implements PipeTransform {
    public transform<T>(value: Iterable<T>, skip: number, take: number): T[] {
        if (!value || !any(value) || skip >= count(value)) {
            return [];
        }
        return from(value).skip(skip).take(take).toArray();
    }
}
