import { Pipe, PipeTransform } from "@angular/core";
import { TimeUnit } from "../models/TimeUnit";
import { DateTime } from "luxon";

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

        if (type === "h") {
            const result = timeValues.filter(hour => {
                let dateWithHour = new Date(normalizedDates.date);
                dateWithHour.setHours(hour.value);
                return (
                    (normalizedDates.minDate ? dateWithHour.getHours() >= normalizedDates.minDate.getHours() : true) &&
                    (normalizedDates.maxDate ? dateWithHour.getHours() <= normalizedDates.maxDate.getHours() : true)
                );
            });
            return result;
        } else if (type === "m") {
            const result = timeValues.filter(minute => {
                if (normalizedDates.minDate && normalizedDates.date.getHours() === normalizedDates.minDate.getHours()) {
                    return minute.value >= normalizedDates.minDate.getMinutes();
                } else if (
                    normalizedDates.maxDate &&
                    normalizedDates.date.getHours() === normalizedDates.maxDate.getHours()
                ) {
                    return minute.value <= normalizedDates.maxDate.getMinutes();
                } else {
                    return true;
                }
            });
            return result;
        } else if (type === "s") {
            const result = timeValues.filter(second => {
                if (
                    normalizedDates.minDate &&
                    normalizedDates.date.getHours() === normalizedDates.minDate.getHours() &&
                    normalizedDates.date.getMinutes() === normalizedDates.minDate.getMinutes()
                ) {
                    return second.value >= normalizedDates.minDate.getSeconds();
                } else if (
                    normalizedDates.maxDate &&
                    normalizedDates.date.getHours() === normalizedDates.maxDate.getHours() &&
                    normalizedDates.date.getMinutes() === normalizedDates.maxDate.getMinutes()
                ) {
                    return second.value <= normalizedDates.maxDate.getSeconds();
                } else {
                    return true;
                }
            });
            return result;
        }
        return timeValues;
    }

    private cloneDate(date: Date): Date {
        return new Date(date.getTime());
    }

    private normalizeDates(
        date: Date,
        min?: Date | null,
        max?: Date | null
    ): { minDate?: Date; maxDate?: Date; date: Date } {
        if (!min && !max) {
            return { minDate: date, maxDate: date, date };
        }
        if (min && !max) {
            const minYears = Math.min(min.getFullYear(), date.getFullYear());
            const minMonths = Math.min(min.getMonth(), date.getMonth());
            const minDays = Math.min(min.getDate(), date.getDate());
            const newMin = new Date(minYears, minMonths, minDays, min.getHours(), min.getMinutes(), min.getSeconds());
            const newDate = new Date(
                minYears,
                minMonths,
                minDays,
                date.getHours(),
                date.getMinutes(),
                date.getSeconds()
            );
            return { minDate: newMin, maxDate: undefined, date: newDate };
        }
        if (!min && max) {
            const maxYears = Math.max(max.getFullYear(), date.getFullYear());
            const maxMonths = Math.max(max.getMonth(), date.getMonth());
            const maxDays = Math.max(max.getDate(), date.getDate());
            const newMax = new Date(maxYears, maxMonths, maxDays, max.getHours(), max.getMinutes(), max.getSeconds());
            const newDate = new Date(
                maxYears,
                maxMonths,
                maxDays,
                date.getHours(),
                date.getMinutes(),
                date.getSeconds()
            );
            return { minDate: undefined, maxDate: newMax, date: newDate };
        }
        if (min && max) {
            const minYears = Math.min(min.getFullYear(), date.getFullYear());
            const minMonths = Math.min(min.getMonth(), date.getMonth());
            const minDays = Math.min(min.getDate(), date.getDate());
            const newMin = new Date(minYears, minMonths, minDays, min.getHours(), min.getMinutes(), min.getSeconds());
            const newMax = new Date(minYears, minMonths, minDays, max.getHours(), max.getMinutes(), max.getSeconds());
            const newDate = new Date(
                minYears,
                minMonths,
                minDays,
                date.getHours(),
                date.getMinutes(),
                date.getSeconds()
            );
            return { minDate: newMin, maxDate: newMax, date: newDate };
        }
        return { minDate: date, maxDate: date, date };
    }
}
