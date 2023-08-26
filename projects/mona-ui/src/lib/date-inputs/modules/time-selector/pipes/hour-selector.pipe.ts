import { Pipe, PipeTransform } from "@angular/core";
import { TimeUnit } from "../models/TimeUnit";
import { Meridiem } from "../../../models/Meridiem";
import { Enumerable } from "@mirei/ts-collections";

@Pipe({
    name: "hourSelector",
    standalone: true
})
export class HourSelectorPipe implements PipeTransform {
    public transform(hours: TimeUnit[], format: "12" | "24", meridiem: Meridiem): TimeUnit[] {
        if (format === "24") {
            return Enumerable.range(0, 24)
                .select<TimeUnit>(h => ({ value: h, viewValue: h }))
                .toArray();
        }
        if (meridiem === "AM") {
            return Enumerable.range(1, 11)
                .select<TimeUnit>(h => ({ value: h, viewValue: h }))
                .prepend({ value: 0, viewValue: 12 })
                .toArray();
        }
        return Enumerable.range(1, 11)
            .select<TimeUnit>(h => ({ value: h + 12, viewValue: h }))
            .prepend({ value: 12, viewValue: 12 })
            .toArray();
    }
}
