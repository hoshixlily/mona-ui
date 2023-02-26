import { Pipe, PipeTransform } from "@angular/core";
import { Enumerable } from "@mirei/ts-collections";

@Pipe({
    name: "gridPage"
})
export class GridPagePipe implements PipeTransform {
    public transform(value: any[], skip: number, take: number): any[] {
        if (!value) {
            return [];
        }
        if (value.length === 0) {
            return value;
        }
        if (skip >= value.length) {
            return [];
        }
        return Enumerable.from(value).skip(skip).take(take).toArray();
    }
}
