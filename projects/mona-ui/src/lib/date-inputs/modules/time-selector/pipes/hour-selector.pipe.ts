import { Pipe, PipeTransform } from "@angular/core";
import { Hour } from "../models/Hour";
import { Meridiem } from "../../../models/Meridiem";
import { Enumerable } from "@mirei/ts-collections";

@Pipe({
    name: "hourSelector"
})
export class HourSelectorPipe implements PipeTransform {
    public transform(hours: Hour[], format: "12" | "24", meridiem: Meridiem): Hour[] {
        if (format === "24") {
            return Enumerable.range(0, 24)
                .select<Hour>(h => ({ value: h, viewValue: h }))
                .toArray();
        }
        if (meridiem === "AM") {
            return Enumerable.range(1, 11)
                .select<Hour>(h => ({ value: h, viewValue: h }))
                .prepend({ value: 0, viewValue: 12 })
                .toArray();
        }
        return Enumerable.range(1, 11)
            .select<Hour>(h => ({ value: h + 12, viewValue: h }))
            .prepend({ value: 12, viewValue: 12 })
            .toArray();
    }
}
