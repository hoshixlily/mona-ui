import { Pipe, PipeTransform } from "@angular/core";
import { TimeUnit } from "../models/TimeUnit";

@Pipe({
    name: "timeLimiter"
})
export class TimeLimiterPipe implements PipeTransform {
    public transform(
        timeValues: TimeUnit[],
        type: "h" | "m" | "s",
        currentDate: Date,
        min?: Date | null,
        max?: Date | null
    ): TimeUnit[] {
        if (!min && !max) {
            return timeValues;
        }
        const normalizedDates = this.normalizeDates(currentDate, min, max);
        const result = timeValues.filter(timeUnit => {
            let dateWithTimeUnit = new Date(normalizedDates.date);
            if (type === "h") {
                dateWithTimeUnit.setHours(timeUnit.value);
                return (
                    (normalizedDates.minDate
                        ? dateWithTimeUnit.getHours() >= normalizedDates.minDate.getHours()
                        : true) &&
                    (normalizedDates.maxDate ? dateWithTimeUnit.getHours() <= normalizedDates.maxDate.getHours() : true)
                );
            } else if (type === "m") {
                if (normalizedDates.minDate && normalizedDates.date.getHours() === normalizedDates.minDate.getHours()) {
                    return timeUnit.value >= normalizedDates.minDate.getMinutes();
                } else if (
                    normalizedDates.maxDate &&
                    normalizedDates.date.getHours() === normalizedDates.maxDate.getHours()
                ) {
                    return timeUnit.value <= normalizedDates.maxDate.getMinutes();
                } else {
                    return true;
                }
            } else if (type === "s") {
                if (
                    normalizedDates.minDate &&
                    normalizedDates.date.getHours() === normalizedDates.minDate.getHours() &&
                    normalizedDates.date.getMinutes() === normalizedDates.minDate.getMinutes()
                ) {
                    return timeUnit.value >= normalizedDates.minDate.getSeconds();
                } else if (
                    normalizedDates.maxDate &&
                    normalizedDates.date.getHours() === normalizedDates.maxDate.getHours() &&
                    normalizedDates.date.getMinutes() === normalizedDates.maxDate.getMinutes()
                ) {
                    return timeUnit.value <= normalizedDates.maxDate.getSeconds();
                } else {
                    return true;
                }
            }
            return false;
        });
        return result;
    }

    private normalizeDates(
        date: Date,
        min?: Date | null,
        max?: Date | null
    ): { minDate?: Date; maxDate?: Date; date: Date } {
        let minDate, maxDate, newDate;
        if (min) {
            const minYears = Math.min(min.getFullYear(), date.getFullYear());
            const minMonths = Math.min(min.getMonth(), date.getMonth());
            const minDays = Math.min(min.getDate(), date.getDate());
            minDate = new Date(minYears, minMonths, minDays, min.getHours(), min.getMinutes(), min.getSeconds());
            newDate = new Date(minYears, minMonths, minDays, date.getHours(), date.getMinutes(), date.getSeconds());
        }
        if (max) {
            const maxYears = Math.max(max.getFullYear(), date.getFullYear());
            const maxMonths = Math.max(max.getMonth(), date.getMonth());
            const maxDays = Math.max(max.getDate(), date.getDate());
            maxDate = new Date(maxYears, maxMonths, maxDays, max.getHours(), max.getMinutes(), max.getSeconds());
            newDate = new Date(maxYears, maxMonths, maxDays, date.getHours(), date.getMinutes(), date.getSeconds());
        }
        return { minDate, maxDate, date: newDate || date };
    }
}
