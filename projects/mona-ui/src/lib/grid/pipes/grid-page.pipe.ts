import { Pipe, PipeTransform } from "@angular/core";
import { Enumerable } from "@mirei/ts-collections";

@Pipe({
    name: "gridPage",
    standalone: true
})
export class GridPagePipe implements PipeTransform {
    public transform<T>(value: T[], skip: number, take: number): T[] {
        if (!value || value.length === 0 || skip >= value.length) {
            return [];
        }
        return Enumerable.from(value).skip(skip).take(take).toArray();
    }
}
