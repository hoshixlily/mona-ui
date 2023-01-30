import { Pipe, PipeTransform } from "@angular/core";
import { Enumerable } from "@mirei/ts-collections";
import { DateTime } from "luxon";

@Pipe({
    name: "monaDateInclude",
    standalone: true
})
export class DateIncludePipe implements PipeTransform {
    public transform(value: Date, dates: Iterable<Date>): boolean {
        const valueDateTime = DateTime.fromJSDate(value);
        return Enumerable.from(dates)
            .select(d => DateTime.fromJSDate(d))
            .any(
                d =>
                    d.hasSame(valueDateTime, "day") &&
                    d.hasSame(valueDateTime, "month") &&
                    d.hasSame(valueDateTime, "year")
            );
    }
}
