import { EqualityComparator } from "@mirei/ts-collections";
import { Column } from "../models/Column";

export const cellComparer = (column: Column): EqualityComparator<any> => {
    return (r1: any, r2: any): boolean => {
        if (column.dataType() === "date") {
            if (r1 == null || r2 == null) {
                return Object.is(r1, r2);
            }
            return compareDates(r1 as Date, r2 as Date);
        }
        return Object.is(r1, r2);
    };
};

export const compareDates = (date1: Date, date2: Date): boolean => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate() &&
        date1.getHours() === date2.getHours() &&
        date1.getMinutes() === date2.getMinutes() &&
        date1.getSeconds() === date2.getSeconds()
    );
};
