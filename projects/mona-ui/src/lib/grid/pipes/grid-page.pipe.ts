import { Pipe, PipeTransform } from "@angular/core";
import { Enumerable } from "@mirei/ts-collections";
import { Row } from "../models/Row";

@Pipe({
    name: "gridPage"
})
export class GridPagePipe implements PipeTransform {
    public transform<T>(value: T[], skip: number, take: number): T[] {
        if (!value || value.length === 0 || skip >= value.length) {
            return [];
        }
        return Enumerable.from(value).skip(skip).take(take).toArray();
    }
}
