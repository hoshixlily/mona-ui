import { ImmutableSet, range, select } from "@mirei/ts-collections";
import { HourFormat } from "../models/HourFormat";
import { Meridiem } from "../models/Meridiem";
import { TimeUnit } from "../models/TimeUnit";

export const generateHourSet = (hourFormat: HourFormat, meridiem: Meridiem): ImmutableSet<TimeUnit> => {
    if (hourFormat === "24") {
        select(range(0, 24), h => ({ value: h, viewValue: h })).toImmutableSet();
    }
    if (meridiem === "AM") {
        return select(range(1, 11), h => ({ value: h, viewValue: h }))
            .prepend({ value: 0, viewValue: 12 })
            .toImmutableSet();
    }
    return select(range(1, 11), h => ({ value: h + 12, viewValue: h }))
        .prepend({ value: 12, viewValue: 12 })
        .toImmutableSet();
};
